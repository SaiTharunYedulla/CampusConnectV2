import { PrismaClient, UserRole, UserStatus, AcademicYear } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ─── Departments ──────────────────────────────────────────────────────────
  const departmentData = [
    { code: 'CSE',   name: 'Computer Science & Engineering' },
    { code: 'CSM',   name: 'Computer Science & Machine Learning' },
    { code: 'CSD',   name: 'Computer Science & Data Science' },
    { code: 'ECE',   name: 'Electronics & Communication Engineering' },
    { code: 'EEE',   name: 'Electrical & Electronics Engineering' },
    { code: 'CIVIL', name: 'Civil Engineering' },
    { code: 'MECH',  name: 'Mechanical Engineering' },
    { code: 'AIDS',  name: 'Artificial Intelligence & Data Science' },
    { code: 'CSBS',  name: 'Computer Science & Business Systems' },
    { code: 'PHE',   name: 'Physical & Health Education' },
  ];

  const departments: Record<string, string> = {};
  for (const dept of departmentData) {
    const d = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
    departments[dept.code] = d.id;
  }
  console.log(`✅ ${departmentData.length} departments seeded`);

  // ─── Achievement Categories ───────────────────────────────────────────────
  const categoryNames = [
    'Hackathon', 'Competition', 'Certification', 'Internship', 'Research',
    'Publication', 'Workshop', 'Conference', 'Project', 'Sports',
    'Cultural', 'Academic', 'Volunteer', 'Other',
  ];
  for (const name of categoryNames) {
    await prisma.achievementCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✅ ${categoryNames.length} achievement categories seeded`);

  // ─── Domains ──────────────────────────────────────────────────────────────
  const domainNames = [
    'AI/ML', 'Web Development', 'Mobile Development', 'Data Science',
    'Cybersecurity', 'Cloud Computing', 'IoT', 'Robotics',
    'Blockchain', 'Software Development', 'Research', 'Management', 'Other',
  ];
  for (const name of domainNames) {
    await prisma.domain.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✅ ${domainNames.length} domains seeded`);

  // ─── Skills ───────────────────────────────────────────────────────────────
  const skillNames = [
    'React', 'Node.js', 'Python', 'Java', 'C++', 'Machine Learning',
    'Data Analysis', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
    'TypeScript', 'JavaScript', 'Flutter', 'Kotlin', 'Swift', 'TensorFlow',
    'FastAPI', 'GraphQL',
  ];
  for (const name of skillNames) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✅ ${skillNames.length} skills seeded`);

  // ─── Badges ───────────────────────────────────────────────────────────────
  const badgeData = [
    {
      name: 'First Verified Achievement',
      description: 'Earned your first verified achievement on CampusConnect.',
      icon: '🏅',
      criteria: { type: 'approved_count', value: 1 },
    },
    {
      name: '5 Verified Achievements',
      description: 'Reached 5 verified achievements. Keep going!',
      icon: '🥈',
      criteria: { type: 'approved_count', value: 5 },
    },
    {
      name: 'Score 90+',
      description: 'Achieved a score of 90 or above on a single achievement.',
      icon: '⭐',
      criteria: { type: 'single_score_gte', value: 90 },
    },
    {
      name: 'Top 3 Department',
      description: 'Ranked in the top 3 of your department leaderboard.',
      icon: '🏆',
      criteria: { type: 'dept_rank_lte', value: 3 },
    },
    {
      name: 'Institute Top 3',
      description: 'Ranked in the top 3 of the institute-wide leaderboard.',
      icon: '👑',
      criteria: { type: 'institute_rank_lte', value: 3 },
    },
    {
      name: 'Academic Excellence',
      description: 'Accumulated a total score of 400 or more across all achievements.',
      icon: '🎓',
      criteria: { type: 'total_score_gte', value: 400 },
    },
  ];
  for (const badge of badgeData) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }
  console.log(`✅ ${badgeData.length} badges seeded`);

  // ─── Admin account ────────────────────────────────────────────────────────
  const adminEmail    = process.env.ADMIN_EMAIL    ?? 'admin@campusconnect.edu';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123';
  const rounds        = Number(process.env.BCRYPT_ROUNDS ?? 12);

  const adminHash = await bcrypt.hash(adminPassword, rounds);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email:        adminEmail,
      passwordHash: adminHash,
      role:         UserRole.ADMIN,
      status:       UserStatus.ACTIVE,
    },
  });
  console.log(`✅ Admin account seeded: ${adminEmail}`);

  // ─── Demo Student ─────────────────────────────────────────────────────────
  const studentHash = await bcrypt.hash('Student@123', rounds);
  const demoStudentUser = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email:        'student@demo.com',
      passwordHash: studentHash,
      role:         UserRole.STUDENT,
      status:       UserStatus.ACTIVE,
    },
  });
  await prisma.student.upsert({
    where: { userId: demoStudentUser.id },
    update: {},
    create: {
      userId:       demoStudentUser.id,
      username:     'demo_student',
      firstName:    'Demo',
      lastName:     'Student',
      departmentId: departments['CSE'],
      academicYear: AcademicYear.THIRD_YEAR,
    },
  });
  console.log('✅ Demo student seeded: student@demo.com / Student@123');

  // ─── Demo Teacher ─────────────────────────────────────────────────────────
  const teacherHash = await bcrypt.hash('Teacher@123', rounds);
  const demoTeacherUser = await prisma.user.upsert({
    where: { email: 'teacher@demo.com' },
    update: {},
    create: {
      email:        'teacher@demo.com',
      passwordHash: teacherHash,
      role:         UserRole.TEACHER,
      status:       UserStatus.ACTIVE,
    },
  });
  await prisma.teacher.upsert({
    where: { userId: demoTeacherUser.id },
    update: {},
    create: {
      userId:       demoTeacherUser.id,
      username:     'demo_teacher',
      firstName:    'Demo',
      lastName:     'Teacher',
      designation:  'Assistant Professor',
      departmentId: departments['CSE'],
    },
  });
  console.log('✅ Demo teacher seeded: teacher@demo.com / Teacher@123');

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
