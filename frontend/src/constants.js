import { broken_bone, medical_team, gynecologist, psychiatrist, bald, stethoscope } from './assets/Doc/init.js';

export const fullDesc = `Manage and share prescriptions securely with our innovative medical app. Effortlessly store
and access prescriptions through a user-friendly interface and robust security features. 
Enhance communication and streamline workflows for healthcare providers and patients 
alike, ensuring accuracy and compliance every step of the way.`


export const colorfulDoctorCategories = [
  {
    icon: medical_team,
    title: 'General & Family Care',
    color: '#fca5a5', // soft red
  },
  {
    icon: gynecologist,
    title: 'Women & Child Care',
    color: '#fde68a', // soft yellow
  },
  {
    icon: psychiatrist,
    title: 'Heart, Brain & Nerve Care',
    color: '#93c5fd', // soft blue
  },
  {
    icon: broken_bone,
    title: 'Bone, Muscle & Joint Care',
    color: '#6ee7b7', // mint green
  },
  {
    icon: bald,
    title: 'Skin, Hair, Dental & Sensory',
    color: '#c4b5fd', // soft violet
  },
  {
    icon: stethoscope,
    title: 'Specialist & Chronic Care',
    color: '#fcd34d', // soft amber
  }
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
