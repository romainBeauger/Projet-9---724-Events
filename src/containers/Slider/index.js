import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  
  // ✅ FIX 1: Tri correctement par date décroissante
  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
    new Date(evtB.date) - new Date(evtA.date)  // Plus récent en premier
  );

  // ✅ FIX 2: useEffect avec les bonnes dépendances
  useEffect(() => {
    // Vérifier que nous avons des données
    if (!byDateDesc || byDateDesc.length === 0) {
      return undefined; // ✅ Return explicite pour consistent-return
    }
    
    const timer = setTimeout(() => {
      // ✅ FIX 3: Utiliser la fonction callback de setState
      setIndex((currentIndex) => 
        currentIndex < byDateDesc.length - 1 ? currentIndex + 1 : 0
      );
    }, 5000);

    // ✅ FIX 4: Nettoyer le timer pour éviter les fuites mémoire
    return () => clearTimeout(timer);
  }, [index, byDateDesc?.length]); // ✅ Dépendances correctes

  if (!byDateDesc || byDateDesc.length === 0) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div key={event.title}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((paginationEvent) => (
                <input
                  key={`pagination-${paginationEvent.title}`} // ✅ Clé unique basée sur titre
                  type="radio"
                  name="radio-button"
                  checked={byDateDesc[index]?.title === paginationEvent.title} // ✅ Comparaison par valeur, pas index !
                  readOnly // ✅ Évite les warnings React
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;