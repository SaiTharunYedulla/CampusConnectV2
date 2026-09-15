import prisma from '@/database/prisma';
import { PostStatus, Prisma } from '@prisma/client';

const postInclude: Prisma.PostInclude = {
  category:   { select: { id: true, name: true } },
  domain:     { select: { id: true, name: true } },
  skills:     { select: { skill: { select: { id: true, name: true } } } },
  media:      true,
  verifiedBy: { select: { id: true, firstName: true, lastName: true } },
  reviews:    {
    orderBy: { createdAt: 'desc' },
    take:    1,
    select:  { action: true, feedback: true, score: true, createdAt: true },
  },
};

export async function create(data: {
  studentId:       string;
  title:           string;
  description:     string;
  achievementDate: Date;
  categoryId?:     string;
  domainId?:       string;
  position?:       string;
  skillIds?:       string[];
}) {
  const { skillIds, ...rest } = data;
  return prisma.post.create({
    data: {
      ...rest,
      position: rest.position as Parameters<typeof prisma.post.create>[0]['data']['position'],
      skills: skillIds?.length
        ? { create: skillIds.map((skillId) => ({ skillId })) }
        : undefined,
    },
    include: postInclude,
  });
}

export async function findById(id: string) {
  return prisma.post.findUnique({ where: { id }, include: postInclude });
}

export async function findByStudentId(
  studentId: string,
  status:    PostStatus | undefined,
  page:      number,
  limit:     number,
) {
  const where: Prisma.PostWhereInput = { studentId, ...(status && { status }) };
  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: postInclude,
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.post.count({ where }),
  ]);
  return { data, total };
}

export async function update(
  postId: string,
  data: Prisma.PostUpdateInput & { skillIds?: string[] },
) {
  const { skillIds, ...rest } = data;

  if (skillIds !== undefined) {
    const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    const resolvedSkillIds = await Promise.all(
      skillIds.map(async (item) => {
        const trimmed = item.trim();
        if (isUuid(trimmed)) return trimmed;
        // Upsert custom skill name
        const skill = await prisma.skill.upsert({
          where:  { name: trimmed },
          update: {},
          create: { name: trimmed },
        });
        return skill.id;
      }),
    );

    // Replace all skills
    await prisma.postSkill.deleteMany({ where: { postId } });
    if (resolvedSkillIds.length > 0) {
      await prisma.postSkill.createMany({
        data: resolvedSkillIds.map((skillId) => ({ postId, skillId })),
      });
    }
  }

  return prisma.post.update({ where: { id: postId }, data: rest, include: postInclude });
}

export async function deletePost(postId: string) {
  await prisma.post.delete({ where: { id: postId } });
}

export async function submitPost(postId: string) {
  return prisma.post.update({
    where: { id: postId },
    data:  { status: PostStatus.PENDING_REVIEW },
    include: postInclude,
  });
}

export async function addMedia(data: {
  postId:     string;
  fileName:   string;
  fileType:   string;
  fileSize:   bigint;
  storageKey: string;
}) {
  return prisma.postMedia.create({ data });
}

export async function findMedia(mediaId: string) {
  return prisma.postMedia.findUnique({ where: { id: mediaId } });
}

export async function deleteMedia(mediaId: string) {
  return prisma.postMedia.delete({ where: { id: mediaId } });
}

export async function countMedia(postId: string) {
  return prisma.postMedia.count({ where: { postId } });
}
