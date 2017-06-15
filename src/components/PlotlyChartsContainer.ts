import { Component, DOM } from "react";

interface WrapperProps {
    class?: string;
    mxform: mxui.lib.form._FormBase;
    mxObject?: mendix.lib.MxObject;
    style?: string;
    readOnly: boolean;
}

interface PlotlyChartsContainerProps extends WrapperProps {
    width: number;
    widthUnit: WidthUnit;
    height: number;
    heightUnit: HeightUnit;
}

interface PlotlyChartsContainerState {
    value: string;
}

type WidthUnit = "percentage" | "pixels";
type HeightUnit = "percentageOfWidth" | "percentageOfParent" | "pixels";

class PlotlyChartsContainer extends Component<PlotlyChartsContainerProps, PlotlyChartsContainerState> {
    render() {
        return DOM.div(null, "Plotly Chart");
    }

    public static parseStyle(style = ""): {[key: string]: string} {
        try {
            return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            // tslint:disable-next-line no-console
            window.console.log("Failed to parse style", style, error);
        }

        return {};
    }
}

export { PlotlyChartsContainer as default, PlotlyChartsContainerProps };
