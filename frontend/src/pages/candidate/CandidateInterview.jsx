import { useState } from 'react'
import InterviewLayout from '../../components/candidate/interviews/InterviewLayout'

function CandidateInterview() {
  const [currentQuestion, setCurrentQuestion] = useState(1)

  const questions = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      topics: ['Arrays', 'Hash Map'],
      status: 'completed',
      description:
        'Given an array of integers and a target value, find two numbers that add up to the target.',
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'nums[0] + nums[1] = 2 + 7 = 9.',
        },
      ],
      constraints: [
        '2 <= nums.length <= 10⁴',
        '-10⁹ <= nums[i] <= 10⁹',
        '-10⁹ <= target <= 10⁹',
      ],
    },

    {
      id: 2,
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      topics: ['Strings', 'Sliding Window'],
      status: 'current',
      description:
        'Given a string s, find the length of the longest substring without repeating characters.',
      examples: [
        {
          input: 's = "abcabcbb"',
          output: '3',
          explanation: 'The answer is "abc", with a length of 3.',
        },
        {
          input: 's = "bbbbb"',
          output: '1',
          explanation: 'The answer is "b", with a length of 1.',
        },
        {
          input: 's = "pwwkew"',
          output: '3',
          explanation: 'The answer is "wke", with a length of 3.',
        },
      ],
      constraints: [
        '0 <= s.length <= 5 × 10⁴',
        's consists of English letters, digits, symbols and spaces.',
        'The input string may contain duplicate characters.',
      ],
    },

    {
      id: 3,
      title: 'Binary Tree Traversal',
      difficulty: 'Medium',
      topics: ['Trees', 'Recursion'],
      status: 'pending',
      description:
        'Given the root of a binary tree, return the preorder traversal of its nodes.',
      examples: [
        {
          input: 'root = [1,null,2,3]',
          output: '[1,2,3]',
          explanation:
            'Visit the root first, followed by the left subtree and then the right subtree.',
        },
      ],
      constraints: [
        'The number of nodes is between 0 and 100.',
        '-100 <= Node.val <= 100',
      ],
    },

    {
      id: 4,
      title: 'Graph Traversal',
      difficulty: 'Medium',
      topics: ['Graphs', 'BFS', 'DFS'],
      status: 'pending',
      description:
        'Given a graph, determine whether all nodes can be reached from a given starting node.',
      examples: [
        {
          input: 'graph = [[1,2],[0,2],[0,1]]',
          output: 'true',
          explanation:
            'All nodes are reachable from the starting node.',
        },
      ],
      constraints: [
        'The graph contains at least one node.',
        'Nodes may have multiple connections.',
      ],
    },

    {
      id: 5,
      title: 'Dynamic Programming',
      difficulty: 'Hard',
      topics: ['DP', 'Optimization'],
      status: 'pending',
      description:
        'Solve the given optimization problem using an efficient dynamic programming approach.',
      examples: [
        {
          input: 'Input depends on the selected problem.',
          output: 'Optimal result',
          explanation:
            'Break the problem into overlapping subproblems and reuse computed results.',
        },
      ],
      constraints: [
        'The solution should be optimized.',
        'Consider both time and space complexity.',
      ],
    },
  ]

  const selectedQuestion = questions.find(
    (question) => question.id === currentQuestion
  )

  return (
    <InterviewLayout
      questions={questions}
      currentQuestion={currentQuestion}
      selectedQuestion={selectedQuestion}
      onQuestionSelect={setCurrentQuestion}
    />
  )
}

export default CandidateInterview