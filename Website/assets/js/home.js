function initializeArchitectureDemo() {
  const domainCards = document.querySelectorAll(".arch-domain-card");
  const pipelineGrid = document.getElementById("arch-pipeline-grid");
  const activeStep = document.getElementById("arch-active-step");
  const flowQueryText = document.getElementById("arch-flow-query");
  const flowDomainText = document.getElementById("arch-flow-domain");
  const flowPipelineTitle = document.getElementById("arch-flow-pipeline-title");
  const strategyPipelineText = document.getElementById("arch-strategy-pipeline");
  const strategyMethodText = document.getElementById("arch-strategy-method");
  const strategyWhatText = document.getElementById("arch-strategy-what");
  const strategyWhyText = document.getElementById("arch-strategy-why");

  if (
    !domainCards.length ||
    !pipelineGrid ||
    !activeStep ||
    !flowQueryText ||
    !flowDomainText ||
    !flowPipelineTitle ||
    !strategyPipelineText ||
    !strategyMethodText ||
    !strategyWhatText ||
    !strategyWhyText
  ) {
    return;
  }

  const pipelineMap = {
    neuro: {
      label: "Neurosciences",
      pipeline: "Neurosciences Pipeline",
      query: "What factors are associated with the management of intracranial hemorrhage after thrombolysis?",
      strategy: "Human-reasoning-inspired two-stage filtering and ranking.",
      what: "This pipeline retrieves medical evidence using both keyword matching(BM25) and semantic search(FAISS). It then applies a human-reasoning-inspired two-step process to select the best evidence. First, the 'Gatekeeper' performs a quick filtering step, similar to how humans eliminate clearly wrong options before thinking deeper. It removes chunks that do not match key requirements such as the condition, anatomical region, treatment, or patient context. Next, the 'Blueprint Generator' and Instruction-Following Re-ranker perform a deeper evaluation by checking how well the remaining chunks support the expected answer. Finally, the top three highest-scoring chunks are selected for answer generation.",
      why: "Hallucination is reduced by limiting the final answer generation to only the most relevant and reliable evidence chunks. The Gatekeeper first removes mismatched or weak context, while the Blueprint Generator and Instruction-Following Re-ranker ensure that the remaining chunks closely satisfy the user’s question. This reduces the chance of the LLM relying on unrelated context or its own internal knowledge.",
    },
    cardio: {
      label: "Cardiovascular Medicine",
      pipeline: "Cardiovascular Medicine Pipeline",
      query: "How should stage-1 hypertension be managed?",
      strategy: "Instruction-aware semantic encoding + HyDE-based retrieval expansion + projection-based embedding fusion",
      what: "CardioRAG first checks whether the user question belongs to the cardiology domain using a pre-retrieval domain gate. If the query is valid, the system creates two query representations: one using INBEDDER for semantic intent and another using HyDE-generated hypothetical cardiology answers. The INBEDDER vector is projected into the INSTRUCTOR document embedding space, then both vectors are fused and used to retrieve relevant cardiology evidence from a FAISS vector database.",
      why: "Hallucination is reduced because the system does not directly generate answers from the LLM’s memory. It first filters out non-cardiology questions, retrieves only relevant cardiology evidence, and instructs the generator to answer using the retrieved context only. The HyDE branch improves evidence matching, while the domain gate prevents unsupported or off-topic medical responses.",
    },
    internal: {
      label: "Internal Medicine",
      pipeline: "Internal Medicine Pipeline",
      query: "What is first-line therapy for type 2 diabetes?",
      strategy: "Answer generation with entity-aware prioritization and multi-model verification",
      what: "Answers internal medicine questions using retrieval-augmented generation, then applies a multi-stage safety workflow: domain/scope gating, retrieval confidence checks, risk-based claim routing, NLI plus judge validation, selective regeneration of weak claims, and final transparent response reconstruction.",
      why: "Hallucination is reduced by constraining generation with retrieved evidence and applying multi-stage verification. The system filters out-of-scope queries, prioritizes high-risk medical entities, and validates claims using semantic similarity, NLI, and LLM-based checks. Unsupported statements are removed or regenerated, while low-confidence outputs trigger cautious responses, ensuring answers remain grounded, accurate, and reliable.",
    },
    primary: {
      label: "Primary Care and Mental Health",
      pipeline: "Primary Care and Mental Health Pipeline",
      query: "What are the main symptoms of depression?",
      strategy: "Evidence-aware adaptive generation control",
      what: "Dynamically constructs prompts using a policy-driven Instructor LLM based on validated evidence quality, combining scope gating, two-phase validation (answerability + authority), and structured generation constraints.",
      why: "Generation is explicitly conditioned on evidence strength and reliability, preventing unsupported outputs, enforcing refusal under weak evidence, and ensuring all responses are grounded through controlled prompting and claim-level traceability.",
    }
  };

  const domainOrder = ["neuro", "cardio", "internal", "primary"];
  let currentIndex = 0;

  function updateDemo(domainKey) {
    const selected = pipelineMap[domainKey] || pipelineMap.neuro;
    const pipelines = pipelineGrid.querySelectorAll(".arch-pipeline");

    domainCards.forEach((card) => {
      card.classList.toggle("is-active", card.dataset.domain === domainKey);
    });

    pipelines.forEach((pipelineCard) => {
      pipelineCard.classList.toggle("is-active", pipelineCard.dataset.domain === domainKey);
    });

    activeStep.classList.toggle("is-active", true);

    flowQueryText.textContent = selected.query;
    flowDomainText.textContent = selected.label;
    flowPipelineTitle.textContent = selected.pipeline;
    strategyPipelineText.textContent = selected.pipeline;
    strategyMethodText.textContent = selected.strategy;
    strategyWhatText.textContent = selected.what;
    strategyWhyText.textContent = selected.why;
  }

  function activateDomain(domainKey) {
    currentIndex = domainOrder.indexOf(domainKey);
    if (currentIndex < 0) currentIndex = 0;
    updateDemo(domainOrder[currentIndex]);
  }

  function handleManualSelection(domainKey) {
    activateDomain(domainKey);
  }

  domainCards.forEach((card) => {
    card.addEventListener("click", () => {
      handleManualSelection(card.dataset.domain);
    });
  });

  activateDomain(domainOrder[currentIndex]);
}

document.addEventListener("DOMContentLoaded", initializeArchitectureDemo);
