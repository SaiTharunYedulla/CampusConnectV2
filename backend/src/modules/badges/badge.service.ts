import prisma from '@/database/prisma';
import { PostStatus } from '@prisma/client';
import { BadgeCriteria } from '@/types';

async function getInstituteRank(studentId: string): Promise<number | null> {
  const results = await prisma.$queryRaw<{ id: string; rank: bigint }[]>`
    SELECT
      s.id,
      RANK() OVER (ORDER BY COALESCE(SUM(p.score), 0) DESC) AS rank
    FROM students s
    LEFT JOIN posts p ON p.student_id = s.id AND p.status = 'APPROVED'
    GROUP BY s.id
  `;
  const row = results.find((r) => r.id === studentId);
  return row ? Number(row.rank) : null;
}

async function getDeptRank(studentId: string, departmentId: string): Promise<number | null> {
  const results = await prisma.$queryRaw<{ id: string; rank: bigint }[]>`
    SELECT
      s.id,
      RANK() OVER (ORDER BY COALESCE(SUM(p.score), 0) DESC) AS rank
    FROM students s
    LEFT JOIN posts p ON p.student_id = s.id AND p.status = 'APPROVED'
    WHERE s.department_id = ${departmentId}::uuid
    GROUP BY s.id
  `;
  const row = results.find((r) => r.id === studentId);
  return row ? Number(row.rank) : null;
}

export async function evaluateBadges(studentId: string): Promise<void> {
  const student = await prisma.student.findUnique({
    where:   { id: studentId },
    include: { badges: true },
  });
  if (!student) return;

  const approvedPosts = await prisma.post.findMany({
    where:  { studentId, status: PostStatus.APPROVED },
    select: { score: true },
  });

  const approvedCount  = approvedPosts.length;
  const totalScore     = approvedPosts.reduce((sum, p) => sum + Number(p.score ?? 0), 0);
  const maxSingleScore = approvedCount > 0
    ? Math.max(...approvedPosts.map((p) => Number(p.score ?? 0)))
    : 0;

  const instRank = await getInstituteRank(studentId);
  const deptRank = student.departmentId
    ? await getDeptRank(studentId, student.departmentId)
    : null;

  const allBadges = await prisma.badge.findMany();
  const earned    = new Set(student.badges.map((b) => b.badgeId));

  for (const badge of allBadges) {
    if (earned.has(badge.id)) continue;

    const criteria = badge.criteria as unknown as BadgeCriteria;
    let qualifies  = false;

    switch (criteria.type) {
      case 'approved_count':
        qualifies = approvedCount >= criteria.value;
        break;
      case 'single_score_gte':
        qualifies = maxSingleScore >= criteria.value;
        break;
      case 'total_score_gte':
        qualifies = totalScore >= criteria.value;
        break;
      case 'institute_rank_lte':
        qualifies = instRank !== null && instRank <= criteria.value;
        break;
      case 'dept_rank_lte':
        qualifies = deptRank !== null && deptRank <= criteria.value;
        break;
    }

    if (qualifies) {
      try {
        await prisma.studentBadge.create({ data: { studentId, badgeId: badge.id } });
        console.log(`🏅 Badge "${badge.name}" awarded to student ${studentId}`);
      } catch {
        // Unique constraint — badge already awarded, safe to ignore
      }
    }
  }
}
