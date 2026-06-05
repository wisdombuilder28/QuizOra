const SUBJECTS = [
  { id: "physics", label: "Physics", blurb: "Motion, forces, energy, and the laws that govern them.", icon: "⚛" },
  { id: "chemistry", label: "Chemistry", blurb: "Atoms, bonds, reactions, and the matter around us.", icon: "⚗" },
  { id: "biology", label: "Biology", blurb: "Cells, genetics, ecosystems, and the science of life.", icon: "🧬" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy", blurb: "Warm-up basics anyone can tackle." },
  { id: "medium", label: "Medium", blurb: "Solid recall and some reasoning." },
  { id: "hard", label: "Hard", blurb: "Deeper concepts and trickier details." },
];

const CHEMISTRY = [
  { q: "What is the chemical symbol for Gold?", options: ["Au", "Ag", "Gd", "Go"], answer: "Au", explanation: "Au comes from the Latin name for gold, 'aurum', meaning 'shining dawn'.", difficulty: "easy" },
  { q: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Argon"], answer: "Nitrogen", explanation: "Nitrogen (N₂) makes up about 78% of the atmosphere, while oxygen accounts for around 21%.", difficulty: "easy" },
  { q: "What is the pH of pure water at 25°C?", options: ["0", "7", "10", "14"], answer: "7", explanation: "Pure water is neutral — equal concentrations of H⁺ and OH⁻ ions give a pH of exactly 7.", difficulty: "easy" },
  { q: "What is the chemical formula for table salt?", options: ["KCl", "NaCl", "NaOH", "CaCl₂"], answer: "NaCl", explanation: "Table salt is sodium chloride: one sodium (Na⁺) ion bonded to one chloride (Cl⁻) ion.", difficulty: "easy" },
  { q: "Which subatomic particle has no electric charge?", options: ["Proton", "Electron", "Neutron", "Positron"], answer: "Neutron", explanation: "Neutrons are electrically neutral. Protons carry +1 charge, electrons −1.", difficulty: "easy" },
  { q: "How many protons does a carbon atom have?", options: ["4", "6", "8", "12"], answer: "6", explanation: "Carbon's atomic number is 6, which means every carbon atom has 6 protons in its nucleus.", difficulty: "medium" },
  { q: "What type of bond holds water molecules together?", options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Metallic bond"], answer: "Hydrogen bond", explanation: "Water molecules attract each other through hydrogen bonds between H atoms and neighboring O atoms.", difficulty: "medium" },
  { q: "What is the main product, besides water, of an acid-base neutralization?", options: ["A salt", "An oxide", "A gas", "An alcohol"], answer: "A salt", explanation: "Acid + base → salt + water. For example, HCl + NaOH → NaCl + H₂O.", difficulty: "medium" },
  { q: "Which element has the highest electronegativity?", options: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"], answer: "Fluorine", explanation: "Fluorine tops the Pauling scale at 3.98 — it pulls electrons more strongly than any other element.", difficulty: "medium" },
  { q: "What is Avogadro's number (approximately)?", options: ["6.022 × 10²³", "3.14 × 10¹⁰", "9.81 × 10²⁴", "1.602 × 10⁻¹⁹"], answer: "6.022 × 10²³", explanation: "Avogadro's number is the count of particles in one mole of a substance — 6.022 × 10²³.", difficulty: "medium" },
  { q: "Which orbital shape corresponds to the quantum number ℓ = 2?", options: ["s", "p", "d", "f"], answer: "d", explanation: "ℓ = 0 is s, ℓ = 1 is p, ℓ = 2 is d, and ℓ = 3 is f orbitals.", difficulty: "hard" },
  { q: "What is the hybridization of carbon in ethyne (C₂H₂)?", options: ["sp", "sp²", "sp³", "sp³d"], answer: "sp", explanation: "The triple bond in ethyne requires sp hybridization, leaving two p-orbitals for the π bonds.", difficulty: "hard" },
  { q: "Which catalyst is used in the Haber process to synthesize ammonia?", options: ["Platinum", "Iron", "Nickel", "Vanadium oxide"], answer: "Iron", explanation: "The Haber process uses a finely divided iron catalyst (with promoters) to combine N₂ and H₂ into NH₃.", difficulty: "hard" },
  { q: "What does a negative ΔG indicate about a reaction?", options: ["Endothermic", "Exothermic", "Spontaneous", "At equilibrium"], answer: "Spontaneous", explanation: "A negative Gibbs free energy change means the reaction is thermodynamically spontaneous.", difficulty: "hard" },
  { q: "Which acid is known as the 'king of chemicals' due to its industrial importance?", options: ["Nitric acid", "Hydrochloric acid", "Sulfuric acid", "Acetic acid"], answer: "Sulfuric acid", explanation: "H₂SO₄ is produced in greater quantity than any other industrial chemical — fertilizers, batteries, refining.", difficulty: "hard" },
];

const PHYSICS = [
  { q: "What is the SI unit of force?", options: ["Joule", "Newton", "Watt", "Pascal"], answer: "Newton", explanation: "Force is measured in newtons (N). One newton accelerates a 1 kg mass at 1 m/s².", difficulty: "easy" },
  { q: "What is the acceleration due to gravity near Earth's surface?", options: ["8.1 m/s²", "9.8 m/s²", "10.8 m/s²", "11.2 m/s²"], answer: "9.8 m/s²", explanation: "Objects in free fall near Earth accelerate at about 9.8 m/s² downward.", difficulty: "easy" },
  { q: "What is the unit of electric current?", options: ["Volt", "Ohm", "Ampere", "Coulomb"], answer: "Ampere", explanation: "Current is measured in amperes (A) — one coulomb of charge passing per second.", difficulty: "easy" },
  { q: "Which scientist formulated the law of universal gravitation?", options: ["Galileo", "Einstein", "Newton", "Kepler"], answer: "Newton", explanation: "Isaac Newton published the law of universal gravitation in his Principia (1687).", difficulty: "easy" },
  { q: "Which quantity is a vector?", options: ["Mass", "Temperature", "Velocity", "Energy"], answer: "Velocity", explanation: "Velocity has both magnitude and direction, making it a vector. Speed (without direction) is scalar.", difficulty: "easy" },
  { q: "What is the speed of light in a vacuum (approximately)?", options: ["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10⁵ m/s"], answer: "3 × 10⁸ m/s", explanation: "Light travels at about 299,792,458 m/s in a vacuum — roughly 3 × 10⁸ m/s.", difficulty: "medium" },
  { q: "Which law states that every action has an equal and opposite reaction?", options: ["Newton's 1st law", "Newton's 2nd law", "Newton's 3rd law", "Hooke's law"], answer: "Newton's 3rd law", explanation: "Newton's third law: for every action force, there is an equal and opposite reaction force.", difficulty: "medium" },
  { q: "Which type of wave does NOT require a medium to travel?", options: ["Sound wave", "Water wave", "Electromagnetic wave", "Seismic wave"], answer: "Electromagnetic wave", explanation: "EM waves (like light) travel through vacuum. Mechanical waves like sound need a medium.", difficulty: "medium" },
  { q: "What does a converging (convex) lens do to parallel light rays?", options: ["Spreads them out", "Focuses them to a point", "Reflects them", "Polarizes them"], answer: "Focuses them to a point", explanation: "A convex lens converges parallel rays through its focal point — the basis of magnifying glasses.", difficulty: "medium" },
  { q: "What quantity does the formula E = mc² describe?", options: ["Momentum", "Kinetic energy", "Mass-energy equivalence", "Gravitational potential"], answer: "Mass-energy equivalence", explanation: "Einstein's equation shows that mass and energy are interchangeable: a small mass equals huge energy.", difficulty: "medium" },
  { q: "Which principle explains why an airplane wing generates lift?", options: ["Pascal's principle", "Bernoulli's principle", "Archimedes' principle", "Doppler's principle"], answer: "Bernoulli's principle", explanation: "Faster airflow over the curved upper wing surface creates lower pressure — Bernoulli's principle gives lift.", difficulty: "hard" },
  { q: "What is the Heisenberg uncertainty principle about?", options: ["Energy conservation", "Position and momentum limits", "Wave-particle duality", "Time dilation"], answer: "Position and momentum limits", explanation: "You cannot simultaneously know a particle's exact position and momentum — there's a fundamental limit.", difficulty: "hard" },
  { q: "What is the unit of magnetic flux?", options: ["Tesla", "Weber", "Henry", "Gauss"], answer: "Weber", explanation: "Magnetic flux is measured in webers (Wb). Tesla is flux density (Wb/m²).", difficulty: "hard" },
  { q: "Which particle mediates the electromagnetic force?", options: ["Gluon", "Photon", "W boson", "Graviton"], answer: "Photon", explanation: "Photons are the gauge bosons that carry the electromagnetic interaction.", difficulty: "hard" },
  { q: "What does entropy measure in thermodynamics?", options: ["Heat capacity", "Disorder", "Pressure", "Temperature"], answer: "Disorder", explanation: "Entropy quantifies the number of microscopic configurations — effectively, the disorder of a system.", difficulty: "hard" },
];

const BIOLOGY = [
  { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi apparatus"], answer: "Mitochondrion", explanation: "Mitochondria generate most of the cell's ATP through cellular respiration.", difficulty: "easy" },
  { q: "What process do plants use to make food from sunlight?", options: ["Respiration", "Photosynthesis", "Fermentation", "Transpiration"], answer: "Photosynthesis", explanation: "Plants convert CO₂ and water into glucose and oxygen using light energy in chloroplasts.", difficulty: "easy" },
  { q: "How many chambers does a human heart have?", options: ["2", "3", "4", "5"], answer: "4", explanation: "The human heart has two atria and two ventricles — four chambers in total.", difficulty: "easy" },
  { q: "What is the basic unit of life?", options: ["Atom", "Molecule", "Cell", "Tissue"], answer: "Cell", explanation: "All living organisms are made of one or more cells — the smallest unit that can be considered alive.", difficulty: "easy" },
  { q: "What is the largest organ in the human body?", options: ["Liver", "Brain", "Skin", "Lungs"], answer: "Skin", explanation: "The skin is the body's largest organ by surface area and weight.", difficulty: "easy" },
  { q: "Which molecule carries genetic information in most living organisms?", options: ["RNA", "DNA", "Protein", "Lipid"], answer: "DNA", explanation: "DNA stores hereditary information in sequences of four nucleotide bases: A, T, C, and G.", difficulty: "medium" },
  { q: "Which blood cells fight infection?", options: ["Red blood cells", "White blood cells", "Platelets", "Plasma cells only"], answer: "White blood cells", explanation: "White blood cells (leukocytes) are the immune system's primary defense against pathogens.", difficulty: "medium" },
  { q: "Which gas do humans exhale in greater amounts than they inhale?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: "Carbon dioxide", explanation: "Cellular respiration produces CO₂ as a waste product, which is then exhaled.", difficulty: "medium" },
  { q: "Which scientist is known for the theory of evolution by natural selection?", options: ["Mendel", "Darwin", "Pasteur", "Watson"], answer: "Darwin", explanation: "Charles Darwin proposed natural selection in 'On the Origin of Species' (1859).", difficulty: "medium" },
  { q: "What part of the plant conducts photosynthesis primarily?", options: ["Roots", "Stem", "Leaves", "Flowers"], answer: "Leaves", explanation: "Leaves contain most of a plant's chloroplasts, making them the main site of photosynthesis.", difficulty: "medium" },
  { q: "During which phase of mitosis do chromosomes align at the cell's equator?", options: ["Prophase", "Metaphase", "Anaphase", "Telophase"], answer: "Metaphase", explanation: "In metaphase, chromosomes line up along the metaphase plate before being pulled apart.", difficulty: "hard" },
  { q: "Which enzyme unwinds the DNA double helix during replication?", options: ["DNA polymerase", "Helicase", "Ligase", "Primase"], answer: "Helicase", explanation: "Helicase breaks the hydrogen bonds between base pairs, unwinding DNA for replication.", difficulty: "hard" },
  { q: "What is the functional unit of the kidney?", options: ["Alveolus", "Neuron", "Nephron", "Hepatocyte"], answer: "Nephron", explanation: "Each kidney contains about a million nephrons, which filter blood and form urine.", difficulty: "hard" },
  { q: "Which part of the brain regulates balance and coordination?", options: ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"], answer: "Cerebellum", explanation: "The cerebellum, at the back of the brain, fine-tunes motor control and balance.", difficulty: "hard" },
  { q: "What molecule is the universal energy currency of cells?", options: ["DNA", "ATP", "Glucose", "NADH"], answer: "ATP", explanation: "Adenosine triphosphate (ATP) releases energy when its phosphate bonds are broken.", difficulty: "hard" },
];

const QUESTION_BANKS = {
  physics: PHYSICS,
  chemistry: CHEMISTRY,
  biology: BIOLOGY,
};

function getQuestions(subject, difficulty) {
  return QUESTION_BANKS[subject].filter((q) => q.difficulty === difficulty);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
