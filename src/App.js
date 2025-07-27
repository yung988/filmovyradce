import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const TMDB_API_KEY = '08a0e075f85065da7cb1f6b6fc95f8c3';
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  const questions = [
    {
      id: 'mood',
      question: 'Jaká je dnes tvoje nálada? 🎭',
      subtitle: 'Vyber, jak se právě cítíš',
      options: [
        { key: 'happy', emoji: '😊', color: 'from-yellow-400 to-orange-500', label: 'Veselá a optimistická', description: 'Chci se smát a užít si to!' },
        { key: 'adventurous', emoji: '🎢', color: 'from-purple-500 to-pink-500', label: 'Dobrodružná', description: 'Potřebuju adrenalin a napětí!' },
        { key: 'romantic', emoji: '💕', color: 'from-pink-400 to-red-500', label: 'Romantická', description: 'Touha po krásných příbězích lásky' },
        { key: 'thoughtful', emoji: '🤔', color: 'from-blue-500 to-indigo-600', label: 'Zamyšlená', description: 'Chci něco, co mě donutí přemýšlet' },
        { key: 'nostalgic', emoji: '🌅', color: 'from-amber-400 to-orange-600', label: 'Nostalgická', description: 'Vrátit se k něčemu známému a milému' }
      ]
    },
    {
      id: 'time',
      question: 'Kolik času máš na sledování? ⏰',
      subtitle: 'Podle času ti doporučím vhodný obsah',
      options: [
        { key: 'short', emoji: '⚡', color: 'from-green-400 to-blue-500', label: '1-2 hodiny', description: 'Krátký film nebo pár epizod seriálu' },
        { key: 'medium', emoji: '🎬', color: 'from-blue-500 to-purple-600', label: '2-3 hodiny', description: 'Plnohodnotný film nebo delší seriál' },
        { key: 'long', emoji: '📺', color: 'from-purple-600 to-pink-600', label: '3+ hodin', description: 'Můžu se ponořit do dlouhého příběhu' },
        { key: 'series', emoji: '🎭', color: 'from-pink-600 to-red-600', label: 'Celý víkend', description: 'Chci binge-watching seriálu!' }
      ]
    },
    {
      id: 'company',
      question: 'S kým budeš sledovat? 👥',
      subtitle: 'Obsah přizpůsobím společnosti',
      options: [
        { key: 'alone', emoji: '🧘', color: 'from-indigo-400 to-purple-600', label: 'Sama pro sebe', description: 'Můj osobní čas na odpočinek' },
        { key: 'partner', emoji: '💑', color: 'from-pink-500 to-red-500', label: 'S partnerem', description: 'Něco, co si oba užijeme' },
        { key: 'family', emoji: '👨‍👩‍👧‍👦', color: 'from-green-400 to-teal-500', label: 'S rodinou', description: 'Pro všechny generace' },
        { key: 'friends', emoji: '👭', color: 'from-yellow-400 to-pink-500', label: 'S kamarádkami', description: 'Společný zážitek s přáteli' }
      ]
    },
    {
      id: 'setting',
      question: 'Jaké prostředí tě láká? 🌍',
      subtitle: 'Kam by ses ráda přenesla?',
      options: [
        { key: 'historical', emoji: '🏰', color: 'from-amber-500 to-orange-600', label: 'Historické období', description: 'Zámky, kostýmy, dávné časy' },
        { key: 'modern', emoji: '🏙️', color: 'from-gray-500 to-gray-700', label: 'Současný svět', description: 'Dnešní realita a problémy' },
        { key: 'nature', emoji: '🌲', color: 'from-green-500 to-teal-600', label: 'Příroda a venkov', description: 'Krásné krajiny, klid přírody' },
        { key: 'fantasy', emoji: '🧙‍♀️', color: 'from-purple-500 to-indigo-600', label: 'Fantasy svět', description: 'Magie, nadpřirozeno, jiné světy' },
        { key: 'foreign', emoji: '🗺️', color: 'from-blue-500 to-cyan-500', label: 'Cizí země', description: 'Poznávání nových kultur' }
      ]
    },
    {
      id: 'protagonist',
      question: 'Jaký hlavní hrdina tě zaujme? 🦸‍♀️',
      subtitle: 'S kým bys ráda prožila příběh?',
      options: [
        { key: 'strong_woman', emoji: '💪', color: 'from-red-500 to-pink-600', label: 'Silná žena', description: 'Nezávislá hrdinova, která si poradí sama' },
        { key: 'family_person', emoji: '👩‍👧‍👦', color: 'from-green-400 to-blue-500', label: 'Rodinný typ', description: 'Milující matka/otec, rodinné hodnoty' },
        { key: 'detective', emoji: '🔍', color: 'from-gray-600 to-blue-700', label: 'Detektiv/vyšetřovatel', description: 'Chytrý člověk řešící záhady' },
        { key: 'artist', emoji: '🎨', color: 'from-purple-400 to-pink-500', label: 'Umělec/tvůrce', description: 'Kreativní duše s vášní pro umění' },
        { key: 'ordinary', emoji: '🌟', color: 'from-yellow-400 to-orange-500', label: 'Obyčejný člověk', description: 'Někdo jako já, se kterým se ztotožním' }
      ]
    },
    {
      id: 'ending',
      question: 'Jaký konec preferuješ? 🎭',
      subtitle: 'Jak by měl příběh skončit?',
      options: [
        { key: 'happy', emoji: '😊', color: 'from-green-400 to-blue-500', label: 'Šťastný konec', description: 'Všechno dopadne dobře!' },
        { key: 'bittersweet', emoji: '🥲', color: 'from-orange-400 to-red-500', label: 'Hořkosladký', description: 'Realistický konec s nadějí' },
        { key: 'open', emoji: '❓', color: 'from-purple-400 to-indigo-500', label: 'Otevřený konec', description: 'Nechá mě přemýšlet, co bude dál' },
        { key: 'surprise', emoji: '😲', color: 'from-pink-400 to-purple-600', label: 'Překvapivý', description: 'Nečekaný zvrat na konci' }
      ]
    }
  ];

  // Sofistikovanější mapování na základě kombinace odpovědí
  const getGenresAndFilters = (answersData = answers) => {
    const { mood, setting, protagonist } = answersData;
    let genres = [];
    let keywords = [];
    let sort_by = 'popularity.desc';
    let vote_average_gte = 6.5;

    // Nálada -> žánry
    switch (mood) {
      case 'happy':
        genres.push(35); // Comedy
        break;
      case 'adventurous':
        genres.push(28, 12, 53); // Action, Adventure, Thriller
        break;
      case 'romantic':
        genres.push(10749, 18); // Romance, Drama
        break;
      case 'thoughtful':
        genres.push(18, 36); // Drama, History
        sort_by = 'vote_average.desc';
        vote_average_gte = 7.5;
        break;
      case 'nostalgic':
        genres.push(10751, 35); // Family, Comedy
        break;
      default:
        // Default case for unknown mood
        break;
    }

    // Prostředí -> dodatečné žánry
    switch (setting) {
      case 'historical':
        genres.push(36, 10752); // History, War
        break;
      case 'nature':
        genres.push(12); // Adventure
        break;
      case 'fantasy':
        genres.push(14, 878); // Fantasy, Science Fiction
        break;
      default:
        // Default case for unknown setting
        break;
    }

    // Protagonista -> klíčová slova a žánry
    switch (protagonist) {
      case 'detective':
        genres.push(80, 9648); // Crime, Mystery
        break;
      case 'family_person':
        genres.push(10751); // Family
        break;
      default:
        // Default case for unknown protagonist
        break;
    }

    return {
      genres: [...new Set(genres)], // Odstranit duplicity
      keywords,
      sort_by,
      vote_average_gte
    };
  };


  const resetQuiz = () => {
    setCurrentStep('welcome');
    setCurrentQuestion(0);
    setAnswers({});
    setRecommendations([]);
    setCurrentPage(1);
  };

  const handleAnswerSelect = (questionId, optionKey) => {
    const newAnswers = { ...answers, [questionId]: optionKey };
    setAnswers(newAnswers);
    
    // Check if this is the last question
    if (currentQuestion === questions.length - 1) {
      // All questions answered, trigger recommendations
      fetchRecommendationsFromAnswers(newAnswers);
    } else {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setCurrentStep('welcome');
    }
  };

  const fetchRecommendationsFromAnswers = async (answersData, page = 1) => {
    setLoading(true);
    try {
      const { genres, sort_by, vote_average_gte } = getGenresAndFilters(answersData);
      const endpoint = 'movie'; // Default to movies for now
      
      const response = await axios.get(`${TMDB_BASE_URL}/discover/${endpoint}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'cs-CZ',
          with_genres: genres.join(','),
          'vote_average.gte': vote_average_gte,
          sort_by: sort_by,
          page: page
        }
      });

      setRecommendations(response.data.results.slice(0, 5));
      setCurrentPage(page);
      setCurrentStep('results');
    } catch (error) {
      console.error('Chyba při načítání doporučení:', error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateRecommendations = () => {
    const nextPage = currentPage + 1;
    fetchRecommendationsFromAnswers(answers, nextPage);
  };

  const getWebshareLink = (title) => {
    // Správný formát URL pro Webshare vyhledávání
    const searchQuery = encodeURIComponent(title);
    return `https://webshare.cz/#/search?what=${searchQuery}`;
  };

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center transform hover:scale-105 transition-transform duration-300">
        <div className="text-6xl mb-6">🎬</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Filmový Kvíz</h1>
        <h2 className="text-2xl font-semibold text-purple-600 mb-6">pro Mámu</h2>
        <p className="text-gray-600 mb-8 text-lg">Pomohu ti vybrat perfektní film nebo seriál podle tvé nálady!</p>
        <button 
          onClick={() => {
            setCurrentStep('quiz');
            setCurrentQuestion(0);
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Začít kvíz 🚀
        </button>
      </div>
    </div>
  );


  const QuestionScreen = () => {
    const currentQ = questions[currentQuestion];
    const selectedAnswer = answers[currentQ.id];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
          {/* Progress Indicator */}
          <div className="text-center mb-6">
            <div className="text-sm font-semibold text-gray-500 mb-2">
              Otázka {currentQuestion + 1} z {questions.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" 
                style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentQ.question}</h2>
            <p className="text-lg text-gray-600">{currentQ.subtitle}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {currentQ.options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswerSelect(currentQ.id, option.key)}
                className={`bg-gradient-to-br ${option.color} hover:scale-105 text-white font-bold p-6 rounded-2xl transition-all duration-300 shadow-lg transform hover:shadow-2xl ${
                  selectedAnswer === option.key ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <div className="text-4xl mb-3">{option.emoji}</div>
                <div className="text-lg font-semibold mb-2">{option.label}</div>
                <div className="text-sm opacity-90">{option.description}</div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button 
              onClick={goToPreviousQuestion}
              className="text-gray-500 hover:text-gray-700 underline flex items-center"
            >
              ← {currentQuestion === 0 ? 'Úvod' : 'Předchozí otázka'}
            </button>
            
            {selectedAnswer && (
              <div className="text-sm text-gray-500">
                {currentQuestion === questions.length - 1 ? 'Klikni na odpověď pro dokončení' : 'Klikni na odpověď pro pokračování'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center">
        <div className="text-6xl mb-6 animate-bounce">🔍</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Hledám filmové poklady...</h2>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Připravuji doporučení právě pro tebe!</p>
      </div>
    </div>
  );

  const ResultsScreen = () => {
    const moodLabels = {
      happy: 'veselé',
      adventurous: 'dobrodružné',
      romantic: 'romantické',
      thoughtful: 'zamyslené',
      nostalgic: 'nostalgické'
    };
    
    const selectedMood = answers.mood;
    const moodLabel = moodLabels[selectedMood] || 'zajímavé';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 py-8 px-4">
        <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">🎊 Tvoje filmové poklady! 🎊</h2>
            <p className="text-xl text-white opacity-90">Vybrala jsem pro tebe {moodLabel} filmy na základě tvých odpovědí</p>
          </div>

          {/* Quick Parameter Editing */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">⚙️ Rychlé úpravy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mood Selection */}
              <div>
                <label className="block text-white font-semibold mb-2">Nálada:</label>
                <select 
                  value={answers.mood || ''}
                  onChange={(e) => {
                    const newAnswers = { ...answers, mood: e.target.value };
                    setAnswers(newAnswers);
                    setCurrentPage(1);
                    fetchRecommendationsFromAnswers(newAnswers, 1);
                  }}
                  className="w-full p-3 rounded-lg bg-white text-gray-800 font-medium shadow-lg"
                >
                  <option value="happy">😊 Veselá</option>
                  <option value="adventurous">🎢 Dobrodružná</option>
                  <option value="romantic">💕 Romantická</option>
                  <option value="thoughtful">🤔 Zamyšlená</option>
                  <option value="nostalgic">🌅 Nostalgická</option>
                </select>
              </div>

              {/* Setting Selection */}
              <div>
                <label className="block text-white font-semibold mb-2">Prostředí:</label>
                <select 
                  value={answers.setting || ''}
                  onChange={(e) => {
                    const newAnswers = { ...answers, setting: e.target.value };
                    setAnswers(newAnswers);
                    setCurrentPage(1);
                    fetchRecommendationsFromAnswers(newAnswers, 1);
                  }}
                  className="w-full p-3 rounded-lg bg-white text-gray-800 font-medium shadow-lg"
                >
                  <option value="historical">🏰 Historické</option>
                  <option value="modern">🏙️ Současné</option>
                  <option value="nature">🌲 Příroda</option>
                  <option value="fantasy">🧙‍♀️ Fantasy</option>
                  <option value="foreign">🗺️ Cizí země</option>
                </select>
              </div>

              {/* Protagonist Selection */}
              <div>
                <label className="block text-white font-semibold mb-2">Protagonista:</label>
                <select 
                  value={answers.protagonist || ''}
                  onChange={(e) => {
                    const newAnswers = { ...answers, protagonist: e.target.value };
                    setAnswers(newAnswers);
                    setCurrentPage(1);
                    fetchRecommendationsFromAnswers(newAnswers, 1);
                  }}
                  className="w-full p-3 rounded-lg bg-white text-gray-800 font-medium shadow-lg"
                >
                  <option value="strong_woman">💪 Silná žena</option>
                  <option value="family_person">👩‍👧‍👦 Rodinný typ</option>
                  <option value="detective">🔍 Detektiv</option>
                  <option value="artist">🎨 Umělec</option>
                  <option value="ordinary">🌟 Obyčejný člověk</option>
                </select>
              </div>
            </div>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recommendations.map((item, index) => {
            const title = item.title || item.name;
            const posterPath = item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : '/api/placeholder/300/450';
            const rating = Math.round(item.vote_average * 10);
            
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <img 
                    src={posterPath} 
                    alt={title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTUwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm font-bold">
                    {rating}%
                  </div>
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.overview ? item.overview.substring(0, 100) + '...' : 'Popis není dostupný'}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Match skóre:</span>
                      <span className="text-lg font-bold text-green-600">{85 + Math.floor(Math.random() * 15)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: `${85 + Math.floor(Math.random() * 15)}%`}}></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => window.open(getWebshareLink(title), '_blank')}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🔍 Hledat na Webshare
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center space-x-4">
          <button 
            onClick={regenerateRecommendations}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🎲 Generovat další filmy
          </button>
          <button 
            onClick={resetQuiz}
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Hrát znovu
          </button>
        </div>
      </div>
    </div>
    );
  };

  if (loading) return <LoadingScreen />;

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen />;
case 'quiz':
      return <QuestionScreen />;
    case 'results':
      return <ResultsScreen />;
    default:
      return <WelcomeScreen />;
  }
};

export default App;
