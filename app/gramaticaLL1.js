gramaticaLL1 = Gramatica.criar({
        'E': ['MF'],
        'F': ['+MF', 'ε'], //E'
        'M': ['PN'],
        'N': ['xPN', 'ε'], //M'
        'P': ['(E)', 'v']
    },
    'ε'
);

analisadorLL1 = LL1.criar(gramaticaLL1, 'E', '$');
