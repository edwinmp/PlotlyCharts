import { Component, DOM } from "react";

// tslint:disable-next-line class-name
class preview extends Component<{}, {}> {
    render() {
        return DOM.div(null, "Plotly Charts Preview");
    }
}

export { preview };
