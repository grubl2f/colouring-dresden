// import L from 'leaflet';

// export const disableLeafletClickPropagation = <T extends HTMLElement | null>(element: T): T => {
export const disableLeafletClickPropagation = <T extends HTMLElement | null>(element: T, leafletDisableClickPropagation: (e: T) => void) => {
  console.debug("disableLeafletClickPropagation:", { element });
  if (element) {
      //L.DomEvent.disableClickPropagation(element)
      leafletDisableClickPropagation(element)
      console.debug('disableLeafletClickPropagation: L.DomEvent.disableClickPropagation(element): disabled: Leaflet Problem')
  }
  // return element;
}

//export const stopLeafletEvents = <T extends HTMLElement | null>(element: T) => {
//  console.debug("stopLeafletEvents:", { element });
//  if (element) {
//    // TODO:
//    //L.DomEvent.disableScrollPropagation(element)
//    //L.DomEvent.disableClickPropagation(element)
//    // // L.DomEvent.stopPropagation(element)
//  }
//  // return element;
//}

// // @function stop(ev: DOMEvent): this
// // Does `stopPropagation` and `preventDefault` at the same time.
// export const stop = (e: HTMLElement) => {
//   preventDefault(e);
//   stopPropagation(e);
//   return this;
// }

// export const stopPropagation = (e: HTMLElement) => {
//   L.DomEvent.stopPropagation(e);
//   if (e.stopPropagation) {
//       e.stopPropagation();
//   } else if (e.originalEvent) {  // In case of Leaflet event.
//       e.originalEvent._stopped = true;
//   } else {
//       e.cancelBubble = true;
//   }
//   return this;
// }

// export const preventDefault = (e) => {
//   L.DomEvent.preventDefault(e);
//   if (e.preventDefault) {
//       e.preventDefault();
//   } else {
//       e.returnValue = false;
//   }
//   return this;
// }
