import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 CORRECTION #1 : Filtrage par type qui FONCTIONNE !
  const eventsByType = !type 
    ? data?.events  // ✅ Si pas de type → tous les événements
    : data?.events?.filter(event => event.type === type); // ✅ Sinon → filtrer par type !

  // CODE D'ORIGINE
  // const filteredEvents = (
  //   (!type
  //     ? data?.events
  //     : data?.events) || []
  // ).filter((event, index) => {
  //   if (
  //     (currentPage - 1) * PER_PAGE <= index &&
  //     PER_PAGE * currentPage > index
  //   ) {
  //     return true;
  //   }
  //   return false;
  // });

  // 📄 CORRECTION #2 : Pagination qui s'applique APRÈS le filtrage
  const filteredEvents = (eventsByType || []).filter((event, index) => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = PER_PAGE * currentPage;
    return startIndex <= index && index < endIndex;
    // ✅ Logique plus claire : entre début et fin de page
  }); 


  // CODE D'ORIGINE
  // const changeType = (evtType) => {
  //   setCurrentPage(1);
  //   setType(evtType);
  // };

  // 🔄 Fonction appelée quand on change de type
  const changeType = (evtType) => {
    console.log("🔍 Changement de type :", evtType);
    setCurrentPage(1); // ✅ Revenir à la page 1
    setType(evtType);  // ✅ Mettre à jour le type
  };

  // CODE D'ORIGINE
  // const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;

  // 📊 Calcul du nombre de pages (basé sur les événements filtrés par type)
  const pageNumber = Math.floor(((eventsByType?.length || 0) - 1) / PER_PAGE) + 1;

  // CODE D'ORIGINE
  // const typeList = new Set(data?.events.map((event) => event.type));

   // 🏷️ Liste des types disponibles (pour le Select)
  const typeList = new Set(data?.events?.map((event) => event.type));

  // 🚧 Condition de garde
  if (error) {
    return <div>Une erreur est survenue</div>;
  }

  if (data === null) {
    return <div>Chargement...</div>;
  }
  
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          
          {/* Code d'origine */}
          {/* <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          /> */}

          {/* 🎛️ CORRECTION #3 : Le Select reçoit la bonne fonction onChange */}
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => changeType(value)} // ✅ Transmission directe !
          />      
          
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>

          {/* 📄 Pagination */}
          {pageNumber > 1 && ( // ✅ Afficher seulement s'il y a plusieurs pages
            <div className="Pagination">
              {Array.from({ length: pageNumber }, (_, index) => index + 1).map((pageNum) => (
                <a 
                  key={`page-${pageNum}`} // ✅ Clé basée sur le numéro de page, pas l'index
                  href="#events" 
                  onClick={() => setCurrentPage(pageNum)}
                  style={{ 
                    fontWeight: currentPage === pageNum ? "bold" : "normal",
                    color: currentPage === pageNum ? "#5B32FF" : "white"
                  }}
                >
                  {pageNum}
                </a>
              ))}
            </div>
          )}

        </>
      )}
    </>
  );
};

export default EventList;
