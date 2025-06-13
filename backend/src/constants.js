export const DB_NAME = 'medify';
export const COOKIE_MAX_AGE = 7*24*60*60*1000
export const DOCTOR_SPECIALIZATIONS = [
  "acupuncturist",
  "allergist/immunologist",
  "andrologist",
  "audiologist",
  "ayurvedic doctor",
  "bariatric surgeon",
  "cardiologist",
  "cardiothoracic surgeon",
  "chiropractor",
  "colorectal surgeon",
  "counselor/therapist",
  "dentist",
  "dermatologist",
  "diabetologist",
  "emergency medicine",
  "endocrinologist",
  "ent specialist",
  "family medicine",
  "fertility specialist",
  "gastroenterologist",
  "general physician",
  "general surgeon",
  "geriatrician",
  "gynecologist",
  "hematologist",
  "hepatologist",
  "homeopath",
  "immunologist",
  "infectious disease specialist",
  "internal medicine",
  "neonatologist",
  "nephrologist",
  "neurologist",
  "neurosurgeon",
  "nutritionist/dietitian",
  "obstetrician",
  "oncologist",
  "ophthalmologist",
  "optometrist",
  "oral surgeon",
  "orthodontist",
  "orthopedic surgeon",
  "pediatrician",
  "periodontist",
  "physiotherapist",
  "plastic surgeon",
  "psychiatrist",
  "psychologist",
  "pulmonologist",
  "reproductive endocrinologist",
  "rheumatologist",
  "sports medicine specialist",
  "thyroid specialist",
  "trichologist",
  "unani doctor",
  "urologist",
  "vascular surgeon"
];

export const DOCTOR_GROUPING = [
  {
    groupId: "1",
    category: "general & family care",
    specializations: [
      "general physician",
      "family medicine",
      "internal medicine",
      "emergency medicine",
      "geriatrician"
    ]
  },
  {
    groupId: "2",
    category: "women & child care",
    specializations: [
      "gynecologist",
      "obstetrician",
      "reproductive endocrinologist",
      "fertility specialist",
      "pediatrician",
      "neonatologist"
    ]
  },
  {
    groupId: "3",
    category: "heart, brain & nerve care",
    specializations: [
      "cardiologist",
      "cardiothoracic surgeon",
      "vascular surgeon",
      "neurologist",
      "neurosurgeon",
      "psychiatrist",
      "psychologist"
    ]
  },
  {
    groupId: "4",
    category: "bone, muscle & joint care",
    specializations: [
      "orthopedic surgeon",
      "rheumatologist",
      "physiotherapist",
      "sports medicine specialist",
      "chiropractor"
    ]
  },
  {
    groupId: "5",
    category: "skin, hair, dental & sensory",
    specializations: [
      "dermatologist",
      "trichologist",
      "ophthalmologist",
      "optometrist",
      "ent specialist",
      "audiologist",
      "dentist",
      "orthodontist",
      "oral surgeon",
      "plastic surgeon"
    ]
  },
  {
    groupId: "6",
    category: "specialist & chronic care",
    specializations: [
      "pulmonologist",
      "gastroenterologist",
      "hepatologist",
      "endocrinologist",
      "diabetologist",
      "nephrologist",
      "urologist",
      "andrologist",
      "oncologist",
      "hematologist",
      "immunologist",
      "infectious disease specialist",
      "nutritionist/dietitian",
      "homeopath",
      "ayurvedic doctor",
      "unani doctor"
    ]
  }
];

export const SPECIALIZATION_TO_GROUPID = {
  // general & family care
  "general physician": "1",
  "family medicine": "1",
  "internal medicine": "1",
  "emergency medicine": "1",
  "geriatrician": "1",

  // women & child care
  "gynecologist": "2",
  "obstetrician": "2",
  "reproductive endocrinologist": "2",
  "fertility specialist": "2",
  "pediatrician": "2",
  "neonatologist": "2",

  // heart, brain & nerve care
  "cardiologist": "3",
  "cardiothoracic surgeon": "3",
  "vascular surgeon": "3",
  "neurologist": "3",
  "neurosurgeon": "3",
  "psychiatrist": "3",
  "psychologist": "3",

  // bone, muscle & joint care
  "orthopedic surgeon": "4",
  "rheumatologist": "4",
  "physiotherapist": "4",
  "sports medicine specialist": "4",
  "chiropractor": "4",

  // skin, hair, dental & sensory
  "dermatologist": "5",
  "trichologist": "5",
  "ophthalmologist": "5",
  "optometrist": "5",
  "ent specialist": "5",
  "audiologist": "5",
  "dentist": "5",
  "orthodontist": "5",
  "oral surgeon": "5",
  "plastic surgeon": "5",

  // specialist & chronic care
  "pulmonologist": "6",
  "gastroenterologist": "6",
  "hepatologist": "6",
  "endocrinologist": "6",
  "diabetologist": "6",
  "nephrologist": "6",
  "urologist": "6",
  "andrologist": "6",
  "oncologist": "6",
  "hematologist": "6",
  "immunologist": "6",
  "infectious disease specialist": "6",
  "nutritionist/dietitian": "6",
  "homeopath": "6",
  "ayurvedic doctor": "6",
  "unani doctor": "6"
};
