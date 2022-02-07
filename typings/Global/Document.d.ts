interface Document {
    // fullscreenElement: Element;
    mozFullScreen: Document['fullscreenElement'];
    webkitFullscreenElement: Document['fullscreenElement'];
    mozCancelFullScreen:Document['exitFullscreen'];
    webkitCancelFullScreen:Document['exitFullscreen'];
}
