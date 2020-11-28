gramaticaPF = Gramatica.criar({
        'E': ['E+M', 'M'],
        'M': ['MxP', 'P'],
        'P': ['(E)', 'v']
    },
    'ε'
);

analisadorPF = PrecedenciaFraca.criar(gramaticaPF, 'E', '$');
