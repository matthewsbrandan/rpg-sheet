const abilities = [
  { name: '11. Arremesso',    description: 'Arremesso: adicione +1 à rolagem de Ataque toda vez que tentar acertar um oponente com alguma arma do tipo Arremesso (veja pág. 53).' },
  { name: '12. Ataque Duplo', description: 'Ataque Duplo: faça a rolagem de Ataque duas vezes.' },
  { name: '13. Caça',         description: 'Caça: você pode construir armadilhas simples e preparar a caça para alimento.' },
  { name: '14. Combate',      description: 'Combate: adicione +1 à rolagem de Ataque toda vez que tentar acertar um oponente com alguma arma do tipo Combate (veja pág. 53).' },
  { name: '15. Conhecimento', description: 'Conhecimento: você é capaz de compreender assuntos específicos  com profundidade considerável.' },
  { name: '16. Construção',   description: 'Construção: você sabe como planejar e executar projetos de habitações, fortificações ou excavações.' },
  { name: '21. Cura',         description: 'Cura: adicione +1 à rolagem de Teste de Atributo toda vez que tentar curar ferimentos. Caso obtenha sucesso, a vítima recupera até 1d3+3 Pontos de Vida.' },
  { name: '22. Diplomacia',   description: 'Diplomacia: você sabe como conduzir  situações delicadas com sensatez.' },
  { name: '23. Erudição',     description: 'Erudição: você é capaz de ler e escrever textos simples.' },
  { name: '24. Escalada',     description: 'Escalada: você pode subir superfícies íngremes.' },
  { name: '25. Exploração',   description: 'Exploração: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar encontrar algo nos ermos.' },
  { name: '26. Feitiçaria',   description: 'Feitiçaria: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar conjurar um feitiço.' },
  { name: '31. Furtividade',  description: 'Furtividade: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar se esconder ou mover-se  silenciosamente.' },
  { name: '32. Herbalismo',   description: 'Herbalismo: você sabe onde buscar  ervas e preparar antídotos e remédios.' },
  { name: '33. Idioma',       description: 'Idioma: você conhece outras línguas e  pode se comunicar em outros idiomas.' },
  { name: '34. Intimidação',  description: 'Intimidação: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar amedrontar ou subjugar alguém.' },
  { name: '35. Lábia',        description: 'Lábia: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar enganar outras pessoas.' },
  { name: '36. Ladinagem',    description: 'Ladinagem: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar abrir fechaduras, desarmar  armadilhas ou furtar alguém.' },
  { name: '41. Lei',          description: 'Lei: você conhece códigos penais.' },
  { name: '42. Liderança',    description: 'Liderança: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar comandar outras pessoas.' },
  { name: '43. Luta',         description: 'Luta: adicione +1 à rolagem de Ataque toda vez que tentar acertar um oponente com alguma  arma do tipo Luta (veja pág. 53).' },
  { name: '44. Manha',        description: 'Manha: você pode resolver embaraços  através de subterfúgios ou contatos.' },
  { name: '45. Montaria',     description: 'Montaria: você sabe conduzir animais.' },
  { name: '46. Navegação',    description: 'Navegação: você conduz embarcações.' },
  { name: '51. Negociação',   description: 'Negociação: adicione +1 à rolagem de Teste de Atributo toda vez que tentar barganhar.' },
  { name: '52. Observação',   description: 'Observação: você pode notar detalhes.' },
  { name: '53. Ocultismo',    description: 'Ocultismo: você pode compreender  assuntos obscuros de natureza mística.' },
  { name: '54. Ofício',       description: 'Ofício: você é capaz de executar um  trabalho específico ou especializado.' },
  { name: '55. Persuasão',    description: 'Persuasão: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar convencer outras pessoas.' },
  { name: '56. Pontaria',     description: 'Pontaria: adicione +1 à rolagem de Ataque toda vez que tentar acertar um oponente com alguma  arma do tipo Pontaria (veja pág. 53).' },
  { name: '61. Prontidão',    description: 'Prontidão: você age primeiro no Ataque e raramente é surpreendido.' },
  { name: '62. Rastreio',     description: 'Rastreio: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar encontrar rastros.' },
  { name: '63. Religião',     description: 'Religião: você conhece ritos e crenças de natureza divina.' },
  { name: '64. Resistência',  description: 'Resistência: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar resistir à um esforço fora do  comum ou estiver sob ação de algum  tipo de veneno ou substância tóxica.' },
  { name: '65. Sobrevivência',description: 'Sobrevivência: adicione +1 à rolagem de Teste de Atributo toda vez que  tentar encontrar abrigo nos ermos.' },
  { name: '66. Tradição',     description: 'Tradição: você conhece costumes, lendas e profecias de um povo' },
];
const arms = [
  { name: "Adaga",             value: '1d6', description: "Arremesso e Luta Cortante e Perfurante", cost: 5 },
  { name: "Arco Curto",        value: '2d6', description: "Pontaria Perfurante (Flecha)", cost: 15 },
  { name: "Arco Longo",        value: '3d6', description: "Pontaria Perfurante (Flecha)", cost: 25 },
  { name: "Arma de Haste",     value: '3d6', description: "Combate Perfurante", cost: 20 },
  { name: "Bastão",            value: '1d6', description: "Luta Contundente", cost: 2 },
  { name: "Besta",             value: '3d6', description: "Pontaria Perfurante (Virote)", cost: 30 },
  { name: "Cajado",            value: '1d6', description: "Luta Contundente", cost: 2 },
  { name: "Chicote",           value: '1d6', description: "Luta Contundente e Cortante", cost: 5 },
  { name: "Clava",             value: '1d6', description: "Luta Contundente", cost: 2 },
  { name: "Clava Grande",      value: '2d6', description: "Luta Contundente", cost: 10 },
  { name: "Clava Gigante",     value: '3d6', description: "Luta Contundente", cost: 20 },
  { name: "Dardo",             value: '1d6', description: "Arremesso e Luta Perfurante", cost: 5 },
  { name: "Espada Curta",      value: '2d6', description: "Combate Cortante e Perfurante", cost: 15 },
  { name: "Espada Longa",      value: '3d6', description: "Combate Cortante e Perfurante", cost: 20 },
  { name: "Faca",              value: '1d6', description: "Arremesso e Luta Cortante e Perfurante", cost: 5 },
  { name: "Funda",             value: '1d6', description: "Pontaria Contundente (Pedra)", cost: 2 },
  { name: "Lança",             value: '2d6', description: "Combate Perfurante", cost: 15 },
  { name: "Lança de Montaria", value: '3d6', description: "Combate Perfurante", cost: 20 },
  { name: "Maça",              value: '1d6', description: "Combate Contundente", cost: 5 },
  { name: "Machado",           value: '2d6', description: "Arremesso e Luta Contundente e Cortante", cost: 10 },
  { name: "Machado de Batalha",value: '3d6', description: "Combate Contundente e Cortante", cost: 20 },
  { name: "Martelo",           value: '1d6', description: "Arremesso e Luta Contundente", cost: 5 },
  { name: "Martelo de Guerra", value: '2d6', description: "Combate Contundente", cost: 15 },
  { name: "Porrete",           value: '1d6', description: "Luta Contundente", cost: 2 },
  { name: "Porrete com Pontas",value: '2d6', description: "Luta Contundente e Perfurante", cost: 10 },
  { name: "Punhal",            value: '1d6', description: "Arremesso e Luta Cortante e Perfurante", cost: 5 },
  { name: "Cota de Malha",     value: '+2',  description: "Reduz Dano Cortante e Perfurante em até 1d3+3 por até 1d3+3 vezes*", cost: 150 },
  { name: "Couraça",           value: '+1',  description: "Reduz Dano Cortante em até 1d6 por até 1d3+3 vezes*", cost: 50 },
  { name: "Escudo Grande",     value: '+1',  description: "Reduz Dano Contundente, Cortante e Perfurante em até 1d6 por até 1d3+3 vezes", cost: 60 },
  { name: "Escudo Pequeno",    value: '+1',  description: "Reduz Dano Contundente, Cortante e Perfurante em até 1d3 por até 1d2+2 vezes", cost: 30 },
  { name: "Peles",             value: '+1',  description: "Reduz Dano Cortante em até 1d3 por até 1d2+2 vezes*", cost: 25 },
];
const equipaments = [
  { name: "Antídoto (para tratar venenos)", cost: 30 },
  { name: "Bandagem (3 unidades)",          cost: 2 },
  { name: "Bolsa",                          cost: 2 },
  { name: "Botas de Viagem",                cost: 5 },
  { name: "Cadeado",                        cost: 15 },
  { name: "Capa",                           cost: 10 },
  { name: "Cesta",                          cost: 1 },
  { name: "Cinto",                          cost: 2 },
  { name: "Cinzel (para esculpir pedra)",   cost: 2 },
  { name: "Comida (3 porções)",             cost: 1 },
  { name: "Corda (3 metros)",               cost: 1 },
  { name: "Corrente (1 metro)",             cost: 5 },
  { name: "Elixir (para tratar doenças)",   cost: 30 },
  { name: "Ervas",                          cost: 5 },
  { name: "Espelho de Metal",               cost: 10 },
  { name: "Flauta",                         cost: 5 },
  { name: "Flechas ou Virotes (6 unidades)",cost: 1 },
  { name: "Formão (para entalhar madeira)", cost: 2 },
  { name: "Gancho",                         cost: 5 },
  { name: "Gazuas (3 unidades)",            cost: 15 },
  { name: "Harpa",                          cost: 20 },
  { name: "Lamparina de Cerâmica",          cost: 2 },
  { name: "Lanterna de Bronze",             cost: 10 },
  { name: "Machadinha",                     cost: 2 },
  { name: "Martelete",                      cost: 2 },
  { name: "Montaria",                       cost: 100 },
  { name: "Odre",                           cost: 2 },
  { name: "Óleo (frasco)",                  cost: 5 },
  { name: "Pederneira",                     cost: 5 },
  { name: "Pedra de Amolar",                cost: 2 },
  { name: "Pergaminho (em branco)",         cost: 30 },
  { name: "Saco",                           cost: 1 },
  { name: "Símbolo Sagrado",                cost: 20 },
  { name: "Tocha (3 unidades)",             cost: 1 },
  { name: "Vela",                           cost: 2 },
  { name: "Veneno (frasco)",                cost: 10 },
];
const magicians = [
  { name: "Afastar Mortos-Vivos", cost: 1, description: "Afasta Mortos-Vivos por até 1d6 minutos" },
  { name: "Banimento",            cost: 3, description: "Afasta Demônios por até 1d6 minutos" },
  { name: "Benção",               cost: 1, description: "Torna uma arma mágica por até 1d6 minutos" },
  { name: "Bola de Fogo",         cost: 3, description: "3d6 Dano e vítima rola Teste para ¹/2 Dano" },
  { name: "Chave Mágica",         cost: 2, description: "Abre uma fechadura ou um cadeado" },
  { name: "Cura",                 cost: 2, description: "Restaura até 1d6+6 Pontos de Vida" },
  { name: "Detecção",             cost: 1, description: "Detecta feitiçaria ou objetos mágicos" },
  { name: "Encanto",              cost: 1, description: "Vítima obedece uma sugestão simples" },
  { name: "Escudo Mágico",        cost: 2, description: "Reduz até 1d6+6 Dano por até 1d6 minutos" },
  { name: "Estilha de Gelo",      cost: 3, description: "3d6 Dano e vítima rola Teste para ¹/2 Dano" },
  { name: "Fechadura Mágica",     cost: 2, description: "Tranca uma fechadura ou um cadeado" },
  { name: "Flecha Mágica",        cost: 1, description: "Dispara uma flecha mágica (1d6 Dano)" },
  { name: "Forma Animal",         cost: 4, description: "Forma de pequeno animal por até 1d6 horas" },
  { name: "Forma Gasosa",         cost: 3, description: "Forma de névoa por até 1d6 minutos" },
  { name: "Fúria",                cost: 1, description: "Adiciona 1d3 Dano por até 1d6 minutos" },
  { name: "Ilusão",               cost: 1, description: "Cria um som ou uma imagem ilusória" },
  { name: "Imunidade",            cost: 3, description: "Concede imunidade a venenos por até 1d6 horas" },
  { name: "Invisibilidade",       cost: 2, description: "Permanece invisível por até 1d6 minutos" },
  { name: "Levitação",            cost: 2, description: "Levita até 1d6+6 metros acima do chão" },
  { name: "Luz",                  cost: 1, description: "Cria uma fonte de luz por até 1d6 horas" },
  { name: "Paralisia",            cost: 2, description: "Paralisa um oponente por até 1d6 minutos" },
  { name: "Petrificação",         cost: 5, description: "Transforma um oponente em pedra" },
  { name: "Portal Mágico",        cost: 4, description: "Cria passagem para até 1d6 quilômetros além" },
  { name: "Proteção",             cost: 1, description: "Reduz até 1d3+3 Dano por até 1d6 minutos" },
  { name: "Raio da Morte",        cost: 6, description: "Provoca morte súbita rolando 1-5 em 1d6" },
  { name: "Raio Mágico",          cost: 2, description: "Dispara até 1d2+2 raios mágicos (1d3 Dano cada)" },
  { name: "Relâmpago",            cost: 3, description: "3d6 Dano e vítima rola Teste para ¹/2 Dano" },
  { name: "Remover Magia",        cost: 3, description: "Remove um efeito mágico" },
  { name: "Remover Maldição",     cost: 5, description: "Remove o efeito de uma maldição" },
  { name: "Remover Paralisia",    cost: 2, description: "Remove um efeito paralisante" },
  { name: "Remover Veneno",       cost: 2, description: "Remove um efeito venenoso" },
  { name: "Ressuscitar Mortos",   cost: 6, description: "Recupera vítima morta até 1d6 dias atrás" },
  { name: "Silêncio",             cost: 1, description: "Cria área silenciosa com 1d6 metros de diâmetro" },
  { name: "Sono",                 cost: 1, description: "Provoca um sono leve na vítima" },
  { name: "Teia Mágica",          cost: 2, description: "Cria área pegajosa com 1d6 metros de diâmetro" },
  { name: "Telepatia",            cost: 3, description: "Comunicação telepática por até 3d6 quilômetros" },
];
const malisons = [
  { value: "11-12", description: "Seu corpo apodrece lentamente, sofrendo 1d3 Dano por dia"             },
  { value: "13-14", description: "Seus olhos se tornam turvos e leitosos, dificultando sua visão"       },
  { value: "15-16", description: "Você é atingido por uma explosão incendiária, sofrendo 1d6 Dano"      },
  { value: "21-22", description: "Seu paladar se torna fraco e insosso, dificultando sua alimentação"   },
  { value: "23-24", description: "Você é transformado em (1d6): 1-3 um corvo ou 4-6 uma coruja"         },
  { value: "25-26", description: "Um par de chifres pesados e pontiagudos surgem da sua cabeça"         },
  { value: "31-32", description: "Seu corpo sofre uma paralisia duradoura e você é incapaz de se mover" },
  { value: "33-34", description: "Toque de Ashaza: seu Modificador de Inteligência é reduzido para -1"  },
  { value: "35-36", description: "Você é transformado em (1d6): 1-3 uma serpente ou 4-6 um lagarto"     },
  { value: "41-42", description: "Uma cabeça demoníaca cresce lentamente do seu ombro direito"          },
  { value: "43-44", description: "Sopro de Vartha: seu Modificador de Sabedoria é reduzido para -1"     },
  { value: "45-46", description: "Você fica confuso e incapaz de lançar feitiços por até 1d6 dias"      },
  { value: "51-52", description: "Você conjura um Morto-Vivo – Sombra Dominadora (pág. 72)"             },
  { value: "53-54", description: "Olhar de Borka: seu Modificador de Personalidade é reduzido para -1"  },
  { value: "55-56", description: "Você conjura uma Besta Demoníaca – Nebelor (pág. 66)"                 },
  { value: "61-62", description: "Você é transformado em (1d6): 1-2 barro, 3-4 carvão ou 5-6 pedra"     },
  { value: "63-64", description: "Você conjura um Demônio de Cinzas (pág. 67)"                          },
  { value: "65-66", description: "Você é atingido por um raio mortal, sofrendo 2d6 Dano"                },
];
const characters = [
  {
    "bio": {
      "nome": "Akesha",
      "ocupacao": "Curandeira",
      "origem": "Planícies Amarelas"
    },
    "atributos": {
      "forca": 9,
      "modificador_forca": 0,
      "agilidade": 8,
      "modificador_agilidade": 0,
      "saude": 16,
      "modificador_saude": 2,
      "inteligencia": 11,
      "modificador_inteligencia": 0,
      "sabedoria": 11,
      "modificador_sabedoria": 0,
      "personalidade": 17,
      "modificador_personalidade": 2,
      "percepcao": 13,
      "modificador_percepcao": 0,
      "furtividade": 15,
      "modificador_furtividade": 0,
      "movimento": 9,
      "modificador_movimento": 0,
      "defesa": 10,
      "modificador_defesa": 0,
      "sanidade": 65,
      "modificador_sanidade": "",
      "vida": 16,
      "modificador_vida": "",
      "habilidades": [
        "43. Luta",
        "26. Feitiçaria",
        "21. Cura",
        "32. Herbalismo",
        "45. Montaria",
        "13. Caça",
        "65. Sobrevivência"
      ]
    },
    "itens": {
      "equipamentos": [
        "Antídoto (para tratar venenos)",
        "Ervas"
      ],
      "armas": [],
      "tesouros": [
        "Moeda 120"
      ]
    },
    "notas": ""
  }, {
    "bio": {
      "nome": "Cindar",
      "ocupacao": "Lenhador de Floresta",
      "origem": "Nimir"
    },
    "atributos": {
      "forca": 18,
      "modificador_forca": 2,
      "agilidade": 15,
      "modificador_agilidade": 1,
      "saude": 14,
      "modificador_saude": 1,
      "inteligencia": 17,
      "modificador_inteligencia": 2,
      "sabedoria": 11,
      "modificador_sabedoria": 0,
      "personalidade": 13,
      "modificador_personalidade": 1,
      "percepcao": 10,
      "modificador_percepcao": 0,
      "furtividade": 10,
      "modificador_furtividade": 0,
      "movimento": 6,
      "modificador_movimento": 0,
      "defesa": 11,
      "modificador_defesa": 0,
      "sanidade": 55,
      "modificador_sanidade": "",
      "vida": 14,
      "modificador_vida": "",
      "habilidades": [
        "43. Luta",
        "26. Feitiçaria",
        "54. Ofício",
        "44. Manha",
        "53. Ocultismo",
        "55. Persuasão"
      ]
    },
    "itens": {
      "equipamentos": [
        "Bolsa",
        "Cinzel (para esculpir pedra)",
        "Elixir (para tratar doenças)",
        "Bandagem (3 unidades)",
        "Machadinha",
        "Odre",
        "Tocha (3 unidades)",
        "Pergaminho (em branco)",
        "Corda (3 metros)"
      ],
      "armas": [
        {
          "name": "Machado de Batalha",
          "value": "3d6"
        }
      ],
      "tesouros": [
        "Moeda 1200"
      ]
    },
    "notas": "2 Cordas"
  }, {
    "bio": {
      "nome": "Gunna",
      "ocupacao": "Conjuradora de Feitiços",
      "origem": "Norte Gélido"
    },
    "atributos": {
      "forca": 10,
      "modificador_forca": 0,
      "agilidade": 13,
      "modificador_agilidade": 1,
      "saude": 10,
      "modificador_saude": 0,
      "inteligencia": 13,
      "modificador_inteligencia": 1,
      "sabedoria": 8,
      "modificador_sabedoria": 0,
      "personalidade": 12,
      "modificador_personalidade": 0,
      "percepcao": 16,
      "modificador_percepcao": 0,
      "furtividade": 13,
      "modificador_furtividade": 1,
      "movimento": 9,
      "modificador_movimento": 0,
      "defesa": 11,
      "modificador_defesa": 0,
      "sanidade": 76,
      "modificador_sanidade": "",
      "vida": 14,
      "modificador_vida": "",
      "habilidades": [
        "13. Caça",
        "43. Luta",
        "65. Sobrevivência",
        "26. Feitiçaria",
        "23. Erudição",
        "46. Navegação",
        "64. Resistência"
      ]
    },
    "itens": {
      "equipamentos": [
        "Flechas ou Virotes (6 unidades)",
        "Vela"
      ],
      "armas": [
        {
          "name": "Arco Curto",
          "value": "2d6"
        },
        {
          "name": "Machado",
          "value": "2d6"
        }
      ],
      "tesouros": [
        "Moeda 50"
      ]
    },
    "notas": "18 flechas"
  }, {
    "bio": {
      "nome": "Mazzur",
      "ocupacao": "Soldado de Batalhas",
      "origem": "Planícies Amarelas"
    },
    "atributos": {
      "forca": 12,
      "modificador_forca": 0,
      "agilidade": 10,
      "modificador_agilidade": 0,
      "saude": 12,
      "modificador_saude": 0,
      "inteligencia": 15,
      "modificador_inteligencia": 1,
      "sabedoria": 16,
      "modificador_sabedoria": 2,
      "personalidade": 14,
      "modificador_personalidade": 1,
      "percepcao": 15,
      "modificador_percepcao": 1,
      "furtividade": 15,
      "modificador_furtividade": 1,
      "movimento": 6,
      "modificador_movimento": 0,
      "defesa": 10,
      "modificador_defesa": 0,
      "sanidade": 54,
      "modificador_sanidade": "",
      "vida": 11,
      "modificador_vida": "",
      "habilidades": [
        "11. Arremesso",
        "14. Combate",
        "13. Caça",
        "43. Luta",
        "45. Montaria",
        "65. Sobrevivência",
        "26. Feitiçaria"
      ]
    },
    "itens": {
      "equipamentos": [
        "Pedra de Amolar",
        "Gancho",
        "Flauta",
        "Lanterna de Bronze"
      ],
      "armas": [
        {
          "name": "Dardo",
          "value": "1d6"
        },
        {
          "name": "Lança de Montaria",
          "value": "3d6"
        },
        {
          "name": "Escudo Grande",
          "value": "+1"
        }
      ],
      "tesouros": [
        "Moeda 293"
      ]
    },
    "notas": ""
  }
];
const npcs = [
  {
    name: 'Mago Abbados',
    attr: { ataque: 8, defesa: 9, sabedoria: 15, movimento: 8 },
    progress_attr: { vida: 14, modificador_vida: '' },
    note: ''
  }, {
    name: 'Varogue',
    attr: { defesa: 13, ataque: 15, movimento: 6 },
    progress_attr: { vida: 24, modificador_vida: '' },
    note: 'Dano 1d6 + 2'
  }, {
    name: 'Nebelor',
    attr: { defesa: 12, ataque: 13, movimento: 10 },
    progress_attr: { vida: 18, modificador_vida: '' },
    note: '* Precisa ser controlado por um feiticeiro\n\n1d4 para decidir o tipo de ataque\n\n#AT1 1d6\n\n#AT2 toque agonizante(1d6 efeito)\n1-3 pele chamuscada (1d6)\n4-5 pele escarificada (2d6)\n6 pele esfolada 3d6'
  }, {
    name: 'Serpente Gigante',
    attr: { defesa: 15, ataque: 16, movimento: 12 },
    progress_attr: { vida: 28, modificador_vida: '' },
    note: '* Teste de agi. do inimigo p/ atacar despercebido (dif: bom)\n* 1d4 para saber o tipo de ataque\n\n#AT1 Picada: 2d6 + veneno(5 pontos depois de 3 rodadas se não curar)\n\n#AT2 Prender: o inimigo perde a rodada tendo que fazer um teste de força contra o dela, se perder, na próxima sofre o #AT1. Neste ataque os ataques de surpresa tem vantagem.'
  }, {
    name: 'Feit. Bhur',
    attr: { defesa: 13, ataque: 6, sabedoria: 15, movimento: 8 },
    progress_attr: { vida: 13, modificador_vida: '' },
    note: ''
  }, {
    name: 'Feit. Belemor',
    attr: { defesa: 9, ataque: 12, sabedoria: 15, movimento: 8 },
    progress_attr: { vida: 9, modificador_vida: '' },
    note: ''
  },
];