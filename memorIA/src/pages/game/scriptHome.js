const { useState, useEffect } = React;

        // Ícones simples em texto
        const RotateCcw = () => <span>🔄</span>;
        const Check = () => <span>✓</span>;

        const MemoryGame = () => {
            const [questionCards, setQuestionCards] = useState([]);
            const [answerCards, setAnswerCards] = useState([]);
            const [selectedCards, setSelectedCards] = useState([]);
            const [matchedPairs, setMatchedPairs] = useState([]);
            const [score, setScore] = useState(0);
            const [attempts, setAttempts] = useState(0);
            const [justification, setJustification] = useState('');
            const [isProcessing, setIsProcessing] = useState(false);

            // Pares de perguntas e respostas com justificativas
            const cardPairs = [
                { id: 1, question: "O que diz a 1ª Lei de Newton?", answer: "Lei da Inércia", justification: "A 1ª Lei de Newton afirma que um corpo em repouso tende a permanecer em repouso, e um corpo em movimento tende a permanecer em movimento com velocidade constante, a menos que uma força atue sobre ele." },
                { id: 2, question: "Qual a fórmula da velocidade média?", answer: "Vm = ΔS/Δt", justification: "A velocidade média é calculada pela divisão da variação do espaço (ΔS) pela variação do tempo (Δt), indicando a rapidez de um corpo em seu percurso." },
                { id: 3, question: "Qual a forma de energia associada ao movimento de um corpo?", answer: "Energia cinética", justification: "A energia cinética é a energia que um corpo em movimento possui. É diretamente proporcional à massa e ao quadrado da velocidade do corpo." },
                { id: 4, question: "O que é um corpo em queda livre?", answer: "Um corpo sujeito apenas à gravidade", justification: "Em queda livre, a única força que atua sobre um corpo é a força da gravidade, ou seja, a resistência do ar é desprezada." },
                { id: 5, question: "Como se chama a força que se opõe ao movimento?", answer: "Atrito", justification: "A força de atrito é uma força de contato que surge quando há uma tendência de movimento entre duas superfícies, agindo no sentido oposto ao movimento." },
                { id: 6, question: "Qual a unidade de medida da força no SI?", answer: "Newton (N)", justification: "A unidade de força no Sistema Internacional (SI) é o Newton, em homenagem a Isaac Newton, e é derivada das unidades de massa (kg), comprimento (m) e tempo (s)." },
                { id: 7, question: "Qual a fórmula da 2ª Lei de Newton?", answer: "F = m.a", justification: "A 2ª Lei de Newton (ou Princípio Fundamental da Dinâmica) mostra que a força resultante (F) sobre um corpo é igual ao produto de sua massa (m) por sua aceleração (a)." },
                { id: 8, question: "Qual a 3ª Lei de Newton?", answer: "Ação e Reação", justification: "A 3ª Lei de Newton diz que para toda ação (força), existe uma reação (força) de mesma intensidade, mesma direção e sentido oposto, atuando em corpos diferentes." }
            ];

            // Inicializar o jogo
            useEffect(() => {
                initializeGame();
            }, []);

            const initializeGame = () => {
                const questions = [];
                const answers = [];
                
                cardPairs.forEach((pair, index) => {
                    questions.push({
                        id: `q-${pair.id}`,
                        content: pair.question,
                        type: 'question',
                        pairId: pair.id,
                        isFlipped: false,
                        isMatched: false
                    });
                    answers.push({
                        id: `a-${pair.id}`,
                        content: pair.answer,
                        type: 'answer',
                        pairId: pair.id,
                        isFlipped: false,
                        isMatched: false
                    });
                });
                
                // Embaralhar as cartas separadamente
                const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
                const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
                
                setQuestionCards(shuffledQuestions);
                setAnswerCards(shuffledAnswers);
                setSelectedCards([]);
                setMatchedPairs([]);
                setScore(0);
                setAttempts(0);
                setJustification('');
                setIsProcessing(false);
            };

            const handleCardClick = (cardId) => {
                // Bloquear cliques durante o processamento
                if (isProcessing) {
                    return;
                }

                // Encontrar a carta nas duas listas
                let card = questionCards.find(c => c.id === cardId);
                let isQuestion = true;
                
                if (!card) {
                    card = answerCards.find(c => c.id === cardId);
                    isQuestion = false;
                }
                
                // Não fazer nada se a carta já está virada, já foi pareada ou já temos 2 cartas selecionadas
                if (card.isFlipped || card.isMatched || selectedCards.length >= 2) {
                    return;
                }

                // Verificar se já temos uma carta do mesmo tipo selecionada
                if (selectedCards.length === 1) {
                    const firstCard = selectedCards[0];
                    if (firstCard.type === card.type) {
                        // Não permitir selecionar duas cartas do mesmo tipo
                        return;
                    }
                }

                // Virar a carta
                if (isQuestion) {
                    const updatedCards = questionCards.map(c => 
                        c.id === cardId ? { ...c, isFlipped: true } : c
                    );
                    setQuestionCards(updatedCards);
                } else {
                    const updatedCards = answerCards.map(c => 
                        c.id === cardId ? { ...c, isFlipped: true } : c
                    );
                    setAnswerCards(updatedCards);
                }
                
                const newSelectedCards = [...selectedCards, card];
                setSelectedCards(newSelectedCards);

                // Se completamos um par, processar automaticamente após um pequeno delay
                if (newSelectedCards.length === 2) {
                    setIsProcessing(true);
                    setTimeout(() => {
                        handleConfirm(newSelectedCards);
                    }, 2000);
                }
            };

            const handleConfirm = (cardsToProcess = selectedCards) => {
                if (cardsToProcess.length !== 2) return;

                setAttempts(attempts + 1);
                const [card1, card2] = cardsToProcess;

                // Verificar se as cartas formam um par
                if (card1.pairId === card2.pairId && card1.type !== card2.type) {
                    // Par correto!
                    const updatedQuestions = questionCards.map(c => 
                        (c.id === card1.id || c.id === card2.id) 
                            ? { ...c, isMatched: true }
                            : c
                    );
                    const updatedAnswers = answerCards.map(c => 
                        (c.id === card1.id || c.id === card2.id) 
                            ? { ...c, isMatched: true }
                            : c
                    );
                    
                    setQuestionCards(updatedQuestions);
                    setAnswerCards(updatedAnswers);
                    setMatchedPairs([...matchedPairs, card1.pairId]);
                    setScore(score + 10);
                    
                    const correctPair = cardPairs.find(p => p.id === card1.pairId);
                    setJustification(correctPair.justification);

                    setSelectedCards([]);
                    setIsProcessing(false);

                    // Limpa a justificativa após alguns segundos
                    setTimeout(() => {
                        setJustification('');
                    }, 5000);

                } else {
                    // Par incorreto - desvirar as cartas após um delay
                    setTimeout(() => {
                        const updatedQuestions = questionCards.map(c => 
                            (c.id === card1.id || c.id === card2.id) 
                                ? { ...c, isFlipped: false }
                                : c
                        );
                        const updatedAnswers = answerCards.map(c => 
                            (c.id === card1.id || c.id === card2.id) 
                                ? { ...c, isFlipped: false }
                                : c
                        );
                        
                        setQuestionCards(updatedQuestions);
                        setAnswerCards(updatedAnswers);
                        setSelectedCards([]);
                        setIsProcessing(false);
                    }, 1500);
                }
            };

            const resetGame = () => {
                initializeGame();
            };

            const isGameComplete = matchedPairs.length === cardPairs.length;

            const renderCard = (card) => {
                const isSelected = selectedCards.some(sc => sc.id === card.id);
                
                // Verificar se a carta deve ficar desabilitada
                let isDisabled = false;
                if (selectedCards.length === 1 && !isSelected) {
                    const firstCard = selectedCards[0];
                    if (firstCard.type === card.type) {
                        isDisabled = true;
                    }
                }
                
                // Desabilitar cliques durante processamento, mas manter visual normal
                const canClick = !isProcessing && !card.isFlipped && !card.isMatched && selectedCards.length < 2 && !isDisabled;
                
                return React.createElement('div', {
                    key: card.id,
                    onClick: canClick ? () => handleCardClick(card.id) : undefined,
                    className: `relative h-32 transition-all duration-300 transform ${canClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'} ${card.isMatched ? 'opacity-60' : ''} ${isSelected ? 'selected-card' : ''}`
                    },
                    React.createElement('div', {
                        className: `absolute inset-0 w-full h-full rounded-lg shadow-lg transition-transform duration-500 preserve-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`
                    },
                        // Verso da carta
                        React.createElement('div', {
                            className: 'absolute inset-0 w-full h-full rounded-lg flex items-center justify-center backface-hidden memoria-dark-teal shadow-lg border-2',
                            style: { borderColor: '#0a5d61' }
                        },
                            React.createElement('div', {
                                className: 'text-white text-5xl'
                            }, '🧠')
                        ),
                        
                        // Frente da carta
                        React.createElement('div', {
                            className: `absolute inset-0 w-full h-full rounded-lg flex items-center justify-center p-3 text-center rotate-y-180 backface-hidden shadow-lg border-2 ${card.type === 'question' ? 'memoria-teal' : 'memoria-orange'}`,
                            style: { borderColor: card.type === 'question' ? '#0d7377' : '#e67e22' }
                        },
                            React.createElement('div', {
                                className: 'text-white text-sm font-medium leading-tight'
                            }, card.content)
                        )
                    )
                );
            };

            return React.createElement('div', {
                className: 'min-h-screen p-6',
                style: { backgroundColor: '#ececdb' }
            }, 
                React.createElement('div', {
                    className: 'max-w-7xl mx-auto'
                },
                    React.createElement('div', {
                        className: 'text-center mb-8'
                    },
                        React.createElement('div', {
                            className: 'flex items-center justify-center gap-4 mb-6'
                        },
                            React.createElement('div', {
                                className: 'text-6xl'
                            }, '🬀'),
                            React.createElement('h1', {
                                className: 'text-5xl font-bold',
                                style: { color: '#0d7377' }
                            }, 'MemorIA'),
                            React.createElement('div', {
                                className: 'text-2xl',
                                style: { color: '#f39c12' }
                            }, '🎓')
                        ),
                        React.createElement('p', {
                            className: 'text-lg mb-6',
                            style: { color: '#0a5d61' }
                        }, 'Jogo da Memória com IA'),
                        React.createElement('div', {
                            className: 'bg-white/80 backdrop-blur-sm rounded-lg p-4 inline-block shadow-lg border',
                            style: { borderColor: '#0d7377' }
                        },
                            React.createElement('div', {
                                className: 'flex gap-6 font-semibold',
                                style: { color: '#0d7377' }
                            },
                                React.createElement('span', {}, `Pontuação: ${score}`),
                                React.createElement('span', {}, `Tentativas: ${attempts}`),
                                React.createElement('span', {}, `Pares encontrados: ${matchedPairs.length}/${cardPairs.length}`)
                            )
                        )
                    ),
                    
                    isGameComplete && React.createElement('div', {
                        className: 'text-center mb-6'
                    },
                        React.createElement('div', {
                            className: 'text-white p-6 rounded-lg inline-block shadow-lg memoria-teal'
                        },
                            React.createElement('h2', {
                                className: 'text-3xl font-bold mb-2'
                            }, '🎉 Parabéns! Você completou o jogo!'),
                            React.createElement('p', {
                                className: 'text-lg'
                            }, `Pontuação final: ${score} pontos em ${attempts} tentativas`)
                        )
                    ),

                    // Bloco para a justificativa
                    justification && React.createElement('div', {
                        className: 'text-center mb-6'
                    },
                        React.createElement('div', {
                            className: 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative max-w-4xl mx-auto',
                            role: 'alert'
                        },
                            React.createElement('strong', {
                                className: 'font-bold'
                            }, 'Curiosidade: '),
                            React.createElement('span', {
                                className: 'block sm:inline'
                            }, justification)
                        )
                    ),

                    // Layout dividido - Perguntas e Respostas
                    React.createElement('div', {
                        className: 'grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6'
                    },
                        // Lado esquerdo - Perguntas
                        React.createElement('div', {
                            className: 'space-y-4'
                        },
                            React.createElement('div', {
                                className: 'text-center mb-4'
                            },
                                React.createElement('h2', {
                                    className: 'text-2xl font-bold memoria-teal text-white p-3 rounded-lg shadow-lg'
                                }, '❓ PERGUNTAS')
                            ),
                            React.createElement('div', {
                                className: 'grid grid-cols-2 gap-4'
                            },
                                questionCards.map(card => renderCard(card))
                            )
                        ),

                        // Lado direito - Respostas
                        React.createElement('div', {
                            className: 'space-y-4'
                        },
                            React.createElement('div', {
                                className: 'text-center mb-4'
                            },
                                React.createElement('h2', {
                                    className: 'text-2xl font-bold memoria-orange text-white p-3 rounded-lg shadow-lg'
                                }, '💡 RESPOSTAS')
                            ),
                            React.createElement('div', {
                                className: 'grid grid-cols-2 gap-4'
                            },
                                answerCards.map(card => renderCard(card))
                            )
                        )
                    ),

                    React.createElement('div', {
                        className: 'text-center space-y-4'
                    },
                        React.createElement('div', {
                            className: 'flex justify-center gap-4'
                        },
                            React.createElement('button', {
                                onClick: resetGame,
                                className: 'px-6 py-3 text-white rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg memoria-orange hover:opacity-90'
                            },
                                React.createElement(RotateCcw),
                                'Novo Jogo'
                            )
                        ),

                        React.createElement('div', {
                            className: 'text-sm max-w-md mx-auto bg-white/60 p-4 rounded-lg shadow-lg',
                            style: { color: '#0a5d61' }
                        },
                            React.createElement('p', {
                                className: 'font-medium mb-2'
                            }, 'Como jogar:'),
                            React.createElement('p', {
                                className: 'mb-1'
                            }, '• Clique nas cartas para virá-las'),
                            React.createElement('p', {
                                className: 'mb-1'
                            }, '• Encontre os pares de pergunta e resposta'),
                            React.createElement('p', {}, '• Selecione uma pergunta e uma resposta para formar um par!')
                        )
                    )
                )
            );
        };

        ReactDOM.render(React.createElement(MemoryGame), document.getElementById('root'));