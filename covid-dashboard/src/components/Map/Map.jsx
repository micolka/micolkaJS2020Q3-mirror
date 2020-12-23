/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import {
  MapContainer, LayerGroup, CircleMarker, TileLayer, Tooltip, useMapEvents,
} from 'react-leaflet';

import styles from '@/assets/stylesheets/map.scss';
import { displayParams } from '@/core/config';
import { ContextApp } from '@/core/reducer';
import { calcCircleRadius } from '@/core/utils';

import { countriesCoords, tileLayerURLs } from './mapConstants';

const Map = props => {
  const { summary } = props;
  const { TotalConfirmed, TotalDeaths, TotalRecovered } = displayParams;
  const [tileLayerParams, setTileLayerParams] = useState(tileLayerURLs[0]);

  const [isLayerChanged, setLayerChanged] = useState(true);
  const [isMenuOpened, setMenuOpened] = useState(false);

  const { state, dispatch } = useContext(ContextApp);
  const { statsF, tableF, graphF, mapF } = state.fullscreen;
  const currentParam = state.currentStat;
  const fillRedOptions = { fillColor: 'red', stroke: false, fillOpacity: 0.5 };
  const fillCurrentOptions = {
    fillColor: 'red', stroke: true, fillOpacity: 1, color: 'blue', weight: 2,
  };

  function selectCountry(e) {
    const alpha2 = e.originalEvent.path[0].classList[0];
    const countryData = summary.Countries.find(elem => elem.CountryCode === alpha2);
    return countryData;
  }

  function setFillOptions(alpha2) {
    if (state.currentCountry) {
      return state.currentCountry.CountryCode === alpha2 ? fillCurrentOptions : fillRedOptions;
    }
    return fillRedOptions;
  }

  function selectParamToDisplay(e) {
    dispatch({
      type: 'SET-DISPLAY-STAT',
      payload: e.target.id,
    });
  }
  function toggleTileSelectorMenu() {
    const map = document.querySelector('.leaflet-container');
    map.classList.toggle('map-container-small');
    setMenuOpened(!isMenuOpened);
  }

  function toggleFullScreen() {
    dispatch({
      type: 'TOGGLE-FULLSCREEN-MODE',
      payload: { mapF: !state.fullscreen.mapF },
    });
    setLayerChanged(false);
  }

  function selectTileLayer(e) {
    const tileLayer = tileLayerURLs.find(layer => layer.name === e.target.id);
    setTileLayerParams(tileLayer);
    toggleTileSelectorMenu();
    setLayerChanged(false);
  }

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        dispatch({
          type: 'SET-CURRENT-COUNTRY',
          payload: selectCountry(e),
        });
      },
    });

    if (state.currentCountry) {
      const coords = countriesCoords
        .find(coordsElem => coordsElem.alpha2 === state.currentCountry.CountryCode);
      const { latitude, longitude } = coords;
      map.flyTo([latitude, longitude], 5);
    }
    return null;
  }

  useEffect(() => {
    setLayerChanged(true);
  });

  return (
    <div className={classNames(styles['map-wrapper'], (statsF || tableF || graphF) ? styles['hide-map'] : '')}>
      {isLayerChanged && (
      <div className={styles['fullscreen-container_wrapper']}>
        <div onClick={toggleFullScreen} className={styles.fullScreenButton}>
          <i className="material-icons">{mapF ? 'fullscreen_exit' : 'fullscreen'}</i>
        </div>
        <MapContainer center={[53.71, 27.95]} zoom={4} minZoom={2} scrollWheelZoom>
          <TileLayer
            attribution={`&copy; <a href="${tileLayerParams.href}">${tileLayerParams.name}</a> contributors`}
            url={tileLayerParams.url}
          />
          <LayerGroup>
            {summary.Countries.map(summaryElem => {
              const coords = countriesCoords
                .find(coordsElem => coordsElem.alpha2 === summaryElem.CountryCode);
              if (!coords) return '';
              const {
                latitude, longitude, numeric, alpha2,
              } = coords;
              return (
                <CircleMarker
                  center={[latitude, longitude]}
                  pathOptions={setFillOptions(alpha2)}
                  radius={calcCircleRadius(summaryElem[currentParam])}
                  key={numeric}
                  className={`${alpha2}`}
                >
                  <Tooltip>{`${summaryElem.Country}: ${summaryElem[currentParam]} cases`}</Tooltip>
                </CircleMarker>
              );
            })}
          </LayerGroup>
          <LocationMarker />
        </MapContainer>
      </div>
      )}
      <div onClick={selectTileLayer} className={classNames(styles['maps_list-menu'], isMenuOpened ? styles['maps_list-active'] : '')}>
        {isMenuOpened
          ? tileLayerURLs.map(layer => <div id={layer.name} className={styles['layer-selector']} key={layer.name}>{layer.name}</div>)
          : ''}
      </div>
      <div className={styles['map_buttons-wrapper']}>
        <div onClick={selectParamToDisplay} className={styles['map_buttons-params_selector']}>
          <div id={TotalConfirmed} className={classNames(styles.map_button, currentParam === TotalConfirmed ? styles['btn-active'] : '')}>Confirmed</div>
          <div id={TotalDeaths} className={classNames(styles.map_button, currentParam === TotalDeaths ? styles['btn-active'] : '')}>Deaths</div>
          <div id={TotalRecovered} className={classNames(styles.map_button, currentParam === TotalRecovered ? styles['btn-active'] : '')}>Recovered</div>
        </div>
        <div onClick={toggleTileSelectorMenu} className={classNames(styles.map_button, isMenuOpened ? styles['menu_btn-active'] : '')}>Select map</div>
      </div>
    </div>
  );
};

export default Map;
