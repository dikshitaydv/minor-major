import {
  findCandidateByIdForRecruiter,
  findCandidatesByRecruiter,
} from '../../repositories/recruiter/candidate.repository.js'

import { NotFoundError } from '../../utils/app-error.js'

// ─────────────────────────────────────────────
// GET ALL CANDIDATES FOR A RECRUITER
// ─────────────────────────────────────────────

export const getRecruiterCandidates = async (
  recruiterId: string,
) => {
  const candidates = await findCandidatesByRecruiter(
    recruiterId,
  )

  return candidates.map((candidate) => {
    const interviews = candidate.candidateInterviews

    // Get all available evaluation scores
    const scores = interviews
      .map((interview) => interview.evaluation?.overallScore)
      .filter(
        (score): score is number =>
          score !== null && score !== undefined,
      )

    // Interviews are already ordered by scheduledAt descending
    const latestInterview = interviews[0] ?? null

    const latestScore =
      latestInterview?.evaluation?.overallScore ?? null

    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce(
              (sum, score) => sum + score,
              0,
            ) / scores.length,
          )
        : null

    return {
      id: candidate.id,

      firstName: candidate.firstName,
      lastName: candidate.lastName,

      name: `${candidate.firstName} ${candidate.lastName}`,

      email: candidate.email,

      interviewCount: interviews.length,

      latestInterview: latestInterview
        ? {
            id: latestInterview.id,
            title: latestInterview.title,
            type: latestInterview.type,
            company: latestInterview.company,
            scheduledAt: latestInterview.scheduledAt,
            status: latestInterview.status,
          }
        : null,

      latestScore,

      averageScore,
    }
  })
}


// ─────────────────────────────────────────────
// GET SINGLE CANDIDATE FOR A RECRUITER
// ─────────────────────────────────────────────

export const getRecruiterCandidateById = async (
  recruiterId: string,
  candidateId: string,
) => {
  const candidate = await findCandidateByIdForRecruiter(
    candidateId,
    recruiterId,
  )

  if (!candidate) {
    throw new NotFoundError('Candidate not found')
  }

  const interviews = candidate.candidateInterviews

  // Get all completed evaluation scores
  const scores = interviews
    .map((interview) => interview.evaluation?.overallScore)
    .filter(
      (score): score is number =>
        score !== null && score !== undefined,
    )

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (sum, score) => sum + score,
            0,
          ) / scores.length,
        )
      : null

  return {
    id: candidate.id,

    firstName: candidate.firstName,
    lastName: candidate.lastName,

    name: `${candidate.firstName} ${candidate.lastName}`,

    email: candidate.email,

    joinedAt: candidate.createdAt,

    stats: {
      totalInterviews: interviews.length,

      completedInterviews: interviews.filter(
        (interview) =>
          interview.status === 'COMPLETED',
      ).length,

      averageScore,
    },

    interviews,
  }
}