import {
    motion,
    useScroll,
    useTransform,
} from 'framer-motion'

function Home() {
    const { scrollYProgress } = useScroll()

    const heroY = useTransform(
        scrollYProgress,
        [0, 0.3],
        [0, -80]
    )

    const heroOpacity = useTransform(
        scrollYProgress,
        [0, 0.25],
        [1, 0]
    )

    return (
        <div className="min-h-screen overflow-hidden bg-white text-[#132b45]">

            {/* =====================================================
          NAVBAR
      ====================================================== */}

            <header className="absolute left-0 top-0 z-50 w-full">

                <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-6 lg:px-10">

                    {/* Logo */}

                    <a
                        href="/"
                        className="flex items-center gap-2.5"
                    >

                        <div className="flex h-8 w-8 items-center justify-center">

                            <div className="relative h-7 w-7 rounded-full border-[4px] border-white">

                                <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-[#c8ff45]" />

                            </div>

                        </div>

                        <span className="text-sm font-semibold tracking-tight text-white">
                            interviewIQ
                        </span>

                    </a>


                    {/* Navigation */}

                    <nav className="hidden items-center gap-9 md:flex">

                        <NavItem href="#about">
                            About
                        </NavItem>

                        <NavItem href="#how-it-works">
                            How it works
                        </NavItem>

                        <NavItem href="#recruiters">
                            Recruiters
                        </NavItem>

                        <NavItem href="#candidates">
                            Candidates
                        </NavItem>

                    </nav>


                    {/* CTA */}

                    <a
                        href="/login"
                        className="group flex items-center gap-2 rounded-full bg-[#c8ff45] px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-[#10263e] transition hover:bg-white"
                    >
                        Sign in

                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10263e] text-white transition group-hover:bg-[#132b45]">
                            ↗
                        </span>

                    </a>

                </div>

            </header>


            {/* =====================================================
          HERO
      ====================================================== */}

            <section className="relative min-h-[760px] overflow-hidden bg-[#0879c9] lg:min-h-[850px]">

                {/* Background gradient */}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,#27a8ef_0%,#0879c9_45%,#035995_100%)]" />


                {/* Glow */}

                <div className="absolute left-1/2 top-[30%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#53c7ff]/20 blur-[100px]" />


                {/* Clouds */}

                <div className="absolute bottom-[-120px] left-[-10%] h-[300px] w-[700px] rounded-[50%] bg-white/80 blur-[50px]" />

                <div className="absolute bottom-[-150px] right-[-10%] h-[350px] w-[700px] rounded-[50%] bg-white/70 blur-[60px]" />


                {/* Hero content */}

                <motion.div
                    style={{
                        y: heroY,
                        opacity: heroOpacity,
                    }}
                    className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-36 text-center lg:pt-44"
                >

                    {/* Eyebrow */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
                        className="mb-7 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
                    >

                        <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff45]" />

                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/80">
                            Adaptive AI Interviewing
                        </span>

                    </motion.div>


                    {/* Heading */}

                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.1,
                        }}
                        className="max-w-4xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl lg:text-[82px]"
                    >
                        Technical interviews
                        <br />

                        <span className="text-[#d9f5ff]">
                            that think with you.
                        </span>
                    </motion.h1>


                    {/* Description */}

                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.25,
                        }}
                        className="mt-7 max-w-xl text-sm leading-6 text-white/70"
                    >
                        interviewIQturns static coding assessments into
                        adaptive conversations that understand reasoning,
                        challenge decisions, and evaluate how candidates
                        actually solve problems.
                    </motion.p>


                    {/* CTA */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.35,
                        }}
                        className="mt-8 flex items-center gap-3"
                    >

                        <a
                            href="/signup"
                            className="group flex items-center gap-2 rounded-full bg-[#c8ff45] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#10263e]"
                        >
                            Get Started

                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10263e] text-white">
                                ↗
                            </span>

                        </a>

                        <a
                            href="#how-it-works"
                            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white/20"
                        >
                            Explore Platform
                        </a>

                    </motion.div>


                    {/* =================================================
              FLOATING INTERFACE
          ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 70,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.45,
                            ease: 'easeOut',
                        }}
                        className="relative mt-20 w-full max-w-4xl"
                    >

                        {/* Left floating card */}

                        <FloatingCard
                            className="absolute -left-8 top-20 hidden w-40 -rotate-6 lg:block"
                        >

                            <p className="text-[8px] uppercase tracking-wider text-slate-400">
                                Reasoning Score
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-[#132b45]">
                                92
                            </p>

                            <div className="mt-2 h-1 bg-slate-100">

                                <div className="h-1 w-[92%] bg-[#3972a7]" />

                            </div>

                        </FloatingCard>


                        {/* Main interview window */}

                        <div className="relative mx-auto w-[88%] overflow-hidden border border-white/20 bg-[#101a25]/95 text-left shadow-[0_40px_100px_rgba(0,30,70,0.35)] backdrop-blur-xl">

                            {/* Top */}

                            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">

                                <div className="flex items-center gap-2">

                                    <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff45]" />

                                    <span className="text-[8px] font-semibold uppercase tracking-wider text-white/50">
                                        Live Interview
                                    </span>

                                </div>

                                <span className="text-[8px] text-white/30">
                                    03 / 07
                                </span>

                            </div>


                            <div className="grid md:grid-cols-[1fr_1.1fr]">

                                {/* Question */}

                                <div className="border-b border-white/10 p-7 md:border-b-0 md:border-r">

                                    <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#71b8ed]">
                                        Algorithms
                                    </p>

                                    <h3 className="mt-4 text-lg font-medium leading-7 text-white">
                                        Design an efficient solution
                                        for finding the top K elements
                                        in an array.
                                    </h3>

                                    <p className="mt-4 text-[9px] leading-5 text-white/35">
                                        Explain your approach, data structure
                                        selection, and expected complexity.
                                    </p>


                                    <div className="mt-8 flex items-center gap-2">

                                        <div className="h-1.5 w-1.5 rounded-full bg-[#71b8ed]" />

                                        <span className="text-[8px] text-white/40">
                                            AI is evaluating your reasoning
                                        </span>

                                    </div>

                                </div>


                                {/* Chat */}

                                <div className="p-7">

                                    <ChatMessage
                                        type="ai"
                                        text="Why would you choose a heap instead of sorting the entire array?"
                                    />

                                    <ChatMessage
                                        type="candidate"
                                        text="A heap allows us to maintain only K elements rather than sorting the entire array."
                                    />

                                    <ChatMessage
                                        type="ai"
                                        text="Good. What would be the time complexity of this approach?"
                                    />

                                    <div className="mt-5 flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">

                                        <span className="text-[9px] text-white/25">
                                            Explain your answer...
                                        </span>

                                        <span className="ml-auto text-white/40">
                                            ↗
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Right floating card */}

                        <FloatingCard
                            className="absolute -right-7 bottom-10 hidden w-44 rotate-6 lg:block"
                        >

                            <div className="flex items-center justify-between">

                                <p className="text-[8px] uppercase tracking-wider text-slate-400">
                                    Evaluation
                                </p>

                                <span className="text-[8px] text-[#4d9b70]">
                                    Strong
                                </span>

                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">

                                <MiniScore
                                    label="Algorithm"
                                    value="88"
                                />

                                <MiniScore
                                    label="Reasoning"
                                    value="94"
                                />

                            </div>

                        </FloatingCard>

                    </motion.div>

                </motion.div>

            </section>


            {/* =====================================================
          TRUST STRIP
      ====================================================== */}

            <section className="border-b border-slate-100 bg-white">

                <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 overflow-hidden px-6 py-7 opacity-40">

                    <TrustLogo text="TECH TALENT" />
                    <TrustLogo text="CAMPUS HIRING" />
                    <TrustLogo text="ENGINEERING" />
                    <TrustLogo text="AI RECRUIT" />
                    <TrustLogo text="NEXTGEN HR" />
                    <TrustLogo text="TECH TEAMS" />

                </div>

            </section>


            {/* =====================================================
          ABOUT
      ====================================================== */}

            <section
                id="about"
                className="bg-white px-6 py-28 lg:px-10"
            >

                <div className="mx-auto max-w-6xl">

                    <div className="text-center">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#3972a7]">
                            About interviewIQ
                        </p>

                        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-[-0.04em] text-[#132b45] lg:text-5xl">
                            A technical interview should reveal
                            <br />
                            <span className="text-slate-400">
                                more than the final answer.
                            </span>
                        </h2>

                    </div>


                    {/* Editorial cards */}

                    <div className="mt-20 grid gap-3 md:grid-cols-12">

                        <ImageCard
                            className="md:col-span-5"
                            image="https://picsum.photos/seed/interviewteam/900/700"
                            label="01 / Human Thinking"
                            title="Understand the thinking behind the code."
                        />

                        <div className="flex flex-col gap-3 md:col-span-3">

                            <InfoCard
                                number="7"
                                label="Evaluation Dimensions"
                                text="From problem understanding to follow-up quality."
                            />

                            <InfoCard
                                number="24/7"
                                label="Interview Availability"
                                text="Candidates can interview without scheduling another meeting."
                                dark
                            />

                        </div>

                        <ImageCard
                            className="md:col-span-4"
                            image="https://picsum.photos/seed/candidatecoding/700/900"
                            label="02 / Adaptive AI"
                            title="Every response can change the next question."
                        />

                    </div>

                </div>

            </section>


            {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

            <section
                id="how-it-works"
                className="bg-[#f5f9fd] px-6 py-28 lg:px-10"
            >

                <div className="mx-auto max-w-6xl">

                    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

                        <div>

                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#3972a7]">
                                How It Works
                            </p>

                            <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-[#132b45] lg:text-5xl">
                                One platform.
                                <br />
                                <span className="text-slate-400">
                                    Three simple steps.
                                </span>
                            </h2>

                        </div>

                        <p className="max-w-sm text-xs leading-6 text-slate-400">
                            From interview configuration to final evaluation,
                            interviewIQhandles the entire technical interview
                            workflow.
                        </p>

                    </div>


                    <div className="mt-16 grid gap-3 md:grid-cols-3">

                        <ProcessCard
                            number="01"
                            title="Configure"
                            text="Build role-specific interviews from your question library. Select difficulty, timing, college, and hiring mode."
                        />

                        <ProcessCard
                            number="02"
                            title="Interview"
                            text="Candidates interact with an AI interviewer that adapts its follow-ups to their responses and reasoning."
                        />

                        <ProcessCard
                            number="03"
                            title="Evaluate"
                            text="Receive structured scores across problem understanding, algorithms, complexity, edge cases, and more."
                        />

                    </div>

                </div>

            </section>


            {/* =====================================================
          RECRUITER
      ====================================================== */}

            <section
                id="recruiters"
                className="bg-white px-6 py-28 lg:px-10"
            >

                <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">

                    <div>

                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#3972a7]">
                            For Recruiters
                        </p>

                        <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.04em] text-[#132b45] lg:text-5xl">
                            Scale technical
                            <br />
                            hiring without
                            <br />
                            scaling interviews.
                        </h2>

                        <p className="mt-6 max-w-md text-xs leading-6 text-slate-400">
                            Create assessments for individual roles, campus
                            drives, or general job postings. Control interview
                            timelines and compare candidates through a
                            consistent evaluation framework.
                        </p>

                        <a
                            href="/signup"
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#132b45] px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-white"
                        >
                            Recruiter Access
                            <span>↗</span>
                        </a>

                    </div>


                    {/* Dashboard visual */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 50,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.3,
                        }}
                        transition={{
                            duration: 0.7,
                        }}
                        className="border border-slate-200 bg-[#f7fafc] p-4"
                    >

                        <div className="border border-slate-200 bg-white">

                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                                <div>

                                    <p className="text-[8px] uppercase tracking-wider text-slate-400">
                                        Recruitment
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-[#132b45]">
                                        Interview Overview
                                    </p>

                                </div>

                                <span className="bg-[#edf7f1] px-2 py-1 text-[8px] font-semibold text-[#4d9b70]">
                                    LIVE
                                </span>

                            </div>


                            <div className="grid grid-cols-3 border-b border-slate-100">

                                <DashboardMetric
                                    label="Candidates"
                                    value="124"
                                />

                                <DashboardMetric
                                    label="Interviews"
                                    value="86"
                                />

                                <DashboardMetric
                                    label="Avg. Score"
                                    value="81"
                                />

                            </div>


                            <div className="p-5">

                                <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
                                    Active Interviews
                                </p>

                                <div className="mt-4 space-y-3">

                                    <RecruiterRow
                                        name="Aarav Sharma"
                                        role="Backend Engineer"
                                        score="92"
                                    />

                                    <RecruiterRow
                                        name="Meera Kapoor"
                                        role="Frontend Developer"
                                        score="88"
                                    />

                                    <RecruiterRow
                                        name="Rohan Mehta"
                                        role="Data Scientist"
                                        score="84"
                                    />

                                </div>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </section>


            {/* =====================================================
          CANDIDATE
      ====================================================== */}

            <section
                id="candidates"
                className="overflow-hidden bg-[#eaf5fc] px-6 py-28 lg:px-10"
            >

                <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

                    <div className="relative">

                        <motion.img
                            initial={{
                                opacity: 0,
                                scale: 1.05,
                            }}
                            whileInView={{
                                opacity: 1,
                                scale: 1,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                duration: 0.8,
                            }}
                            src="https://picsum.photos/seed/techcandidate/1000/800"
                            alt="Candidate"
                            className="h-[450px] w-full object-cover"
                        />

                        <div className="absolute bottom-5 left-5 bg-white p-5 shadow-xl">

                            <p className="text-[8px] uppercase tracking-wider text-slate-400">
                                Candidate Experience
                            </p>

                            <p className="mt-2 max-w-[170px] text-sm font-semibold leading-5 text-[#132b45]">
                                Show how you think,
                                not just what you know.
                            </p>

                        </div>

                    </div>


                    <div>

                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#3972a7]">
                            For Candidates
                        </p>

                        <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.04em] text-[#132b45] lg:text-5xl">
                            Your solution is
                            <br />
                            only the beginning.
                        </h2>

                        <p className="mt-6 max-w-md text-xs leading-6 text-slate-500">
                            Explain your approach, defend your decisions,
                            respond to follow-up questions, and demonstrate
                            the depth of your technical understanding.
                        </p>


                        <div className="mt-8 space-y-5">

                            <CandidatePoint
                                title="Conversational"
                                text="Talk through your solution naturally."
                            />

                            <CandidatePoint
                                title="Adaptive"
                                text="Follow-up questions respond to your answers."
                            />

                            <CandidatePoint
                                title="Transparent"
                                text="Understand how your performance was evaluated."
                            />

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
          FINAL CTA
      ====================================================== */}

            <section className="bg-[#132b45] px-6 py-28 lg:px-10">

                <div className="mx-auto max-w-4xl text-center">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#c8ff45]">
                        The Future Of Technical Interviews
                    </p>

                    <h2 className="mt-5 text-4xl font-medium leading-tight tracking-[-0.04em] text-white lg:text-6xl">
                        Stop measuring answers.
                        <br />
                        Start understanding ability.
                    </h2>

                    <p className="mx-auto mt-6 max-w-lg text-xs leading-6 text-white/40">
                        Build better technical interviews with adaptive
                        AI and structured evaluation.
                    </p>

                    <a
                        href="/signup"
                        className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#c8ff45] px-6 py-3.5 text-[9px] font-bold uppercase tracking-wider text-[#132b45]"
                    >
                        Get Started
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#132b45] text-white">
                            ↗
                        </span>
                    </a>

                </div>

            </section>


            {/* =====================================================
          FOOTER
      ====================================================== */}

            <footer className="bg-[#0d2033] px-6 py-10 lg:px-10">

                <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row">

                    <div>

                        <p className="text-sm font-semibold text-white">
                            interviewIQ
                        </p>

                        <p className="mt-2 text-[9px] text-white/30">
                            Adaptive technical interviewing platform.
                        </p>

                    </div>


                    <div className="flex gap-8">

                        <a
                            href="#about"
                            className="text-[9px] text-white/40 hover:text-white"
                        >
                            About
                        </a>

                        <a
                            href="#how-it-works"
                            className="text-[9px] text-white/40 hover:text-white"
                        >
                            How It Works
                        </a>

                        <a
                            href="#recruiters"
                            className="text-[9px] text-white/40 hover:text-white"
                        >
                            Recruiters
                        </a>

                        <a
                            href="#candidates"
                            className="text-[9px] text-white/40 hover:text-white"
                        >
                            Candidates
                        </a>

                    </div>

                </div>

            </footer>

        </div>
    )
}


/* ============================================================
   SMALL COMPONENTS
============================================================ */

function NavItem({
    href,
    children,
}) {
    return (
        <a
            href={href}
            className="text-[9px] font-semibold uppercase tracking-wider text-white/70 transition hover:text-white"
        >
            {children}
        </a>
    )
}


function FloatingCard({
    className,
    children,
}) {
    return (
        <motion.div
            animate={{
                y: [0, -8, 0],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={`z-20 border border-white/60 bg-white p-4 shadow-2xl ${className}`}
        >
            {children}
        </motion.div>
    )
}


function MiniScore({
    label,
    value,
}) {
    return (
        <div className="bg-slate-50 p-2">

            <p className="text-[7px] text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-bold text-[#132b45]">
                {value}
            </p>

        </div>
    )
}


function ChatMessage({
    type,
    text,
}) {
    const ai = type === 'ai'

    return (
        <div className="mb-5 flex gap-3">

            <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center text-[7px] font-bold ${ai
                        ? 'bg-[#203b54] text-[#71b8ed]'
                        : 'bg-[#31516c] text-white'
                    }`}
            >
                {ai ? 'AI' : 'C'}
            </div>

            <div>

                <p className="text-[8px] font-semibold text-white/30">
                    {ai
                        ? 'Interviewer'
                        : 'Candidate'}
                </p>

                <p className="mt-1 text-[9px] leading-5 text-white/65">
                    {text}
                </p>

            </div>

        </div>
    )
}


function TrustLogo({
    text,
}) {
    return (
        <div className="whitespace-nowrap text-[9px] font-bold tracking-wider text-slate-400">
            ◉ {text}
        </div>
    )
}


function ImageCard({
    className,
    image,
    label,
    title,
}) {
    return (
        <motion.div
            whileHover={{
                y: -5,
            }}
            transition={{
                duration: 0.3,
            }}
            className={`relative min-h-[340px] overflow-hidden ${className}`}
        >

            <img
                src={image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071827]/90 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">

                <p className="text-[8px] font-semibold uppercase tracking-wider text-white/60">
                    {label}
                </p>

                <p className="mt-2 max-w-xs text-lg font-medium leading-6 text-white">
                    {title}
                </p>

            </div>

        </motion.div>
    )
}


function InfoCard({
    number,
    label,
    text,
    dark = false,
}) {
    return (
        <div
            className={`flex flex-1 flex-col justify-between p-6 ${dark
                    ? 'bg-[#132b45] text-white'
                    : 'bg-[#f2f5f7]'
                }`}
        >

            <p
                className={`text-4xl font-medium tracking-tight ${dark
                        ? 'text-[#c8ff45]'
                        : 'text-[#132b45]'
                    }`}
            >
                {number}
            </p>

            <div>

                <p
                    className={`text-[9px] font-bold uppercase tracking-wider ${dark
                            ? 'text-white/70'
                            : 'text-slate-500'
                        }`}
                >
                    {label}
                </p>

                <p
                    className={`mt-2 text-[9px] leading-4 ${dark
                            ? 'text-white/40'
                            : 'text-slate-400'
                        }`}
                >
                    {text}
                </p>

            </div>

        </div>
    )
}


function ProcessCard({
    number,
    title,
    text,
}) {
    return (
        <motion.div
            whileHover={{
                y: -6,
            }}
            className="border border-slate-200 bg-white p-7"
        >

            <p className="text-[9px] font-bold tracking-wider text-[#8eb9df]">
                {number}
            </p>

            <h3 className="mt-12 text-xl font-medium text-[#132b45]">
                {title}
            </h3>

            <p className="mt-4 text-[10px] leading-5 text-slate-400">
                {text}
            </p>

            <div className="mt-8 flex justify-end">

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef6fc] text-[#3972a7]">
                    ↗
                </span>

            </div>

        </motion.div>
    )
}


function DashboardMetric({
    label,
    value,
}) {
    return (
        <div className="border-r border-slate-100 p-4 last:border-r-0">

            <p className="text-xl font-semibold text-[#132b45]">
                {value}
            </p>

            <p className="mt-1 text-[7px] uppercase tracking-wider text-slate-400">
                {label}
            </p>

        </div>
    )
}


function RecruiterRow({
    name,
    role,
    score,
}) {
    return (
        <div className="flex items-center justify-between border border-slate-100 px-3 py-3">

            <div className="flex items-center gap-3">

                <div className="flex h-7 w-7 items-center justify-center bg-[#e8f2fb] text-[7px] font-bold text-[#3972a7]">
                    {name
                        .split(' ')
                        .map((word) => word[0])
                        .join('')}
                </div>

                <div>

                    <p className="text-[9px] font-semibold text-[#132b45]">
                        {name}
                    </p>

                    <p className="mt-0.5 text-[7px] text-slate-400">
                        {role}
                    </p>

                </div>

            </div>

            <div>

                <span className="text-xs font-bold text-[#132b45]">
                    {score}
                </span>

                <span className="text-[7px] text-slate-300">
                    /100
                </span>

            </div>

        </div>
    )
}


function CandidatePoint({
    title,
    text,
}) {
    return (
        <div className="flex gap-4">

            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d5efff] text-[9px] text-[#3972a7]">
                ✓
            </div>

            <div>

                <p className="text-xs font-semibold text-[#132b45]">
                    {title}
                </p>

                <p className="mt-1 text-[9px] leading-4 text-slate-400">
                    {text}
                </p>

            </div>

        </div>
    )
}


export default Home