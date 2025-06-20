import React from 'react';

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

const DoctorGroups = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Find Doctors By Category</h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {DOCTOR_GROUPING.map(({ groupId, category, specializations }) => (
          <div
            key={groupId}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col"
          >
            <h3 className="text-xl font-semibold text-blue-600 capitalize mb-4">{category}</h3>
            <ul className="text-gray-700 text-sm list-disc list-inside space-y-1">
              {specializations.map((spec) => (
                <li key={spec} className="capitalize">{spec}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorGroups;
