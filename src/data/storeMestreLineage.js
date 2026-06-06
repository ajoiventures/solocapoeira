// Generated lightweight Mestre lineage metadata for startup/store logic.
// Keep full lineage UI data in mestreLineage.js.
export const STORE_MESTRE_LINEAGES = {
  "mestre_bimba": {
    "key": "mestre_bimba",
    "name": "Bimba Lineage — The Regional Way",
    "progressionPath": [
      {
        "order": 1,
        "mestre": "mestre_bimba"
      },
      {
        "order": 2,
        "mestre": "mestre_acordeon"
      },
      {
        "order": 3,
        "mestre": "mestre_grão"
      },
      {
        "order": 4,
        "mestre": "mestre_paulo_santos"
      }
    ],
    "reward": {
      "title": "Regional Master",
      "cosmetic": "Bimba's Strategic Crown",
      "bonus": "+15% speed and directness"
    }
  },
  "mestre_pastinha": {
    "key": "mestre_pastinha",
    "name": "Pastinha Lineage — The Angola Way",
    "progressionPath": [
      {
        "order": 1,
        "mestre": "mestre_pastinha"
      },
      {
        "order": 2,
        "mestre": "mestre_nenel"
      },
      {
        "order": 3,
        "mestre": "mestre_santo"
      },
      {
        "order": 4,
        "mestre": "mestre_nestor"
      }
    ],
    "reward": {
      "title": "Angola Elder",
      "cosmetic": "Pastinha's Ancestral Wisdom Crown",
      "bonus": "+20% spiritual mastery and reading ability"
    }
  },
  "mestre_waldemar": {
    "key": "mestre_waldemar",
    "name": "Waldemar Lineage — The Hybrid Path",
    "progressionPath": [
      {
        "order": 1,
        "mestre": "mestre_waldemar"
      },
      {
        "order": 2,
        "mestre": "mestre_gildo"
      },
      {
        "order": 3,
        "mestre": "mestre_amancio"
      },
      {
        "order": 4,
        "mestre": "mestre_decânio"
      }
    ],
    "reward": {
      "title": "Hybrid Master",
      "cosmetic": "Waldemar's Balanced Crown",
      "bonus": "+15% versatility and style blending"
    }
  },
  "mestre_besouro": {
    "key": "mestre_besouro",
    "name": "Besouro Lineage — The Warrior Way",
    "progressionPath": [
      {
        "order": 1,
        "mestre": "mestre_besouro"
      },
      {
        "order": 2,
        "mestre": "mestre_valmir"
      },
      {
        "order": 3,
        "mestre": "mestre_moraes"
      }
    ],
    "reward": {
      "title": "Unbreakable Warrior",
      "cosmetic": "Besouro's Resilience Crown",
      "bonus": "+20% resilience and combat effectiveness"
    }
  },
  "mestre_canjiquinha": {
    "key": "mestre_canjiquinha",
    "name": "Canjiquinha Lineage — The Rhythm Way",
    "progressionPath": [
      {
        "order": 1,
        "mestre": "mestre_canjiquinha"
      },
      {
        "order": 2,
        "mestre": "mestre_valmir"
      },
      {
        "order": 3,
        "mestre": "mestre_sergio"
      }
    ],
    "reward": {
      "title": "Rhythm Master",
      "cosmetic": "Canjiquinha's Musical Crown",
      "bonus": "+25% rhythm mastery and berimbau synchronization"
    }
  },
  "mestre_toni_vargas": {
    "key": "mestre_toni_vargas",
    "name": "Contemporary Lineage — The Modern Way",
    "progressionPath": [
      {
        "order": 1,
        "mestre": "mestre_toni_vargas"
      },
      {
        "order": 2,
        "mestre": "mestre_cobra_additional"
      },
      {
        "order": 3,
        "mestre": "mestre_paulo_santos"
      }
    ],
    "reward": {
      "title": "Modern Master",
      "cosmetic": "Contemporary Crown",
      "bonus": "+20% teaching effectiveness and global influence"
    }
  }
};

export function getStoreMestreLineage(mestreId) {
  for (const lineage of Object.values(STORE_MESTRE_LINEAGES)) {
    const currentMestre = lineage.progressionPath.find((step) => step.mestre === mestreId);
    if (currentMestre) return { ...lineage, currentMestre };
  }
  return null;
}

export function getStoreLineageProgress(lineageKey, defeatedMestres = []) {
  const lineage = STORE_MESTRE_LINEAGES[lineageKey];
  if (!lineage) return null;

  const defeated = lineage.progressionPath.filter((step) => defeatedMestres.includes(step.mestre)).length;
  const isComplete = defeated === lineage.progressionPath.length;

  return {
    lineageName: lineage.name,
    defeated,
    total: lineage.progressionPath.length,
    percentComplete: Math.round((defeated / lineage.progressionPath.length) * 100),
    isComplete,
    completed: isComplete,
    reward: lineage.reward,
  };
}
