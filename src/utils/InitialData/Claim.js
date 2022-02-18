const generateClaims = (identityId) => [
  {
    id: "first_name.personal_information.claim:vrsc",
    displayName: 'First Name',
    data: "Alice",
    hash: "fj024jigd2g2g2oe2kf02dofk",
    parentClaims: ["drivers_license.composite.claim:vrsc"],
    childClaims: [],
    hidden: false,
    categoryId: `${identityId}-other`,
    identity: identityId,
    uid: "8fdhfiuwne298efjf2efdji",
  },
  {
    id: "last_name.personal_information.claim:vrsc",
    displayName: 'Last Name',
    data: "Aardvark",
    hash: "fj02e2f24ji2oe2kf02dofk",
    parentClaims: ["drivers_license.composite.claim:vrsc"],
    childClaims: [],
    hidden: false,
    categoryId: `${identityId}-other`,
    identity: identityId,
    uid: "8fdhfi32iefjfjdduwne298efjf2efdji",
  },
  {
    id: "birth_date.personal_information.claim:vrsc",
    displayName: 'Birth Date',
    data: "01/01/0001",
    hash: "fj0242gdji2oe2kf02dofk",
    parentClaims: ["drivers_license.composite.claim:vrsc"],
    childClaims: [],
    hidden: false,
    categoryId: `${identityId}-other`,
    identity: identityId,
    uid: "8fdhf42df2dfdf2fdi32iefjfjdduwne298efjf2efdji",
  },
  {
    id: "drivers_license.composite.claim:vrsc",
    displayName: 'Driver\'s License',
    data: "",
    hash: "fj024jiddddd2oe2kf02dofk",
    parentClaims: [],
    childClaims: [
      "birth_date.personal_information.claim:vrsc",
      "first_name.personal_information.claim:vrsc",
      "last_name.personal_information.claim:vrsc",
    ],
    hidden: false,
    categoryId: `${identityId}-other`,
    identity: identityId,
    uid: "2ej2ifjofjo2idjklmfd",
  },
];

export default generateClaims;