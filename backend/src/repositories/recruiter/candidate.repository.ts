import prisma from '../../lib/prisma.js'

// ─────────────────────────────────────────────
// FIND ALL CANDIDATES FOR A RECRUITER
// ─────────────────────────────────────────────

export const findCandidatesByRecruiter = async (
  recruiterId: string,
) => {
  return prisma.user.findMany({
    where: {
      role: 'CANDIDATE',

      candidateInterviews: {
        some: {
          recruiterId,
        },
      },
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,

      candidateInterviews: {
        where: {
          recruiterId,
        },

        select: {
          id: true,
          title: true,
          type: true,
          company: true,
          scheduledAt: true,
          status: true,

          evaluation: {
            select: {
              overallScore: true,
            },
          },
        },

        orderBy: {
          scheduledAt: 'desc',
        },
      },
    },

    orderBy: {
      firstName: 'asc',
    },
  })
}


// ─────────────────────────────────────────────
// FIND ONE CANDIDATE FOR A RECRUITER
// ─────────────────────────────────────────────

export const findCandidateByIdForRecruiter = async (
  candidateId: string,
  recruiterId: string,
) => {
  return prisma.user.findFirst({
    where: {
      id: candidateId,

      role: 'CANDIDATE',

      candidateInterviews: {
        some: {
          recruiterId,
        },
      },
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,

      candidateInterviews: {
        where: {
          recruiterId,
        },

        select: {
          id: true,
          title: true,
          type: true,
          company: true,
          focusAreas: true,
          scheduledAt: true,
          duration: true,
          status: true,

          session: {
            select: {
              id: true,
              status: true,
              startedAt: true,
              endedAt: true,
              durationSeconds: true,
            },
          },

          evaluation: {
            select: {
              id: true,
              overallScore: true,
              algorithmCorrectness: true,
              logicalReasoning: true,
              conceptCoverage: true,
              completeness: true,
              dataStructure: true,
              complexity: true,
              edgeCases: true,
              strengths: true,
              improvements: true,
              feedback: true,
              createdAt: true,
            },
          },
        },

        orderBy: {
          scheduledAt: 'desc',
        },
      },
    },
  })
}