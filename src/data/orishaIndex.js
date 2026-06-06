// Generated lightweight Orisha metadata for startup/store gating.
// Keep rich Orisha profiles in orishas.js.
export const ORISHA_INDEX = [
  {
    "id": "orisha_ogun",
    "name": "Ogun",
    "tier": "core",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_obatala",
    "name": "Obatala",
    "tier": "paramount",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_ifa",
    "name": "Ifa (Orumila)",
    "tier": "major",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_yemaya",
    "name": "Yemaya",
    "tier": "paramount",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_shango",
    "name": "Shango",
    "tier": "paramount",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_oshun",
    "name": "Oshun",
    "tier": "major",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_oya",
    "name": "Oya",
    "tier": "major",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_elegba",
    "name": "Elegba (Exu)",
    "tier": "major",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_babaluaye",
    "name": "Babaluaye",
    "tier": "important",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_ibeji",
    "name": "Ibeji",
    "tier": "important",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_aje",
    "name": "Aje",
    "tier": "important",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_oshosi",
    "name": "Oshosi",
    "tier": "important",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_nana_buruku",
    "name": "Nana Buruku",
    "tier": "important",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_erinle",
    "name": "Erinle",
    "tier": "important",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_oba",
    "name": "Oba",
    "tier": "important",
    "gatingRequirements": {}
  },
  {
    "id": "orisha_shun",
    "name": "Shun",
    "tier": "important",
    "gatingRequirements": {}
  },
  {
    "id": "ehi_transcendence",
    "name": "Ehi",
    "tier": "transcendence",
    "gatingRequirements": {}
  }
];

const ORISHA_BY_ID = new Map(ORISHA_INDEX.map((orisha) => [orisha.id, orisha]));

export function getOrishaMetaById(id) {
  return ORISHA_BY_ID.get(id) || null;
}

export function getCoreOrishaCount() {
  return 16;
}
