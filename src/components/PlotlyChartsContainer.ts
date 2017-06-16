// tslint:disable no-console
import { Component, createElement } from "react";

import { BarData, BarMode, Datum } from "plotly.js";
import { PlotlyBar } from "./PlotlyBar";

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
    barMode: BarMode;
    title?: string;
    seriesEntity: string;
    seriesNameAttribute: string;
    dataEntity: string;
    xValueAttribute: string;
    yValueAttribute: string;
}

interface PlotlyChartsContainerState {
    data?: BarData[];
}

type WidthUnit = "percentage" | "pixels";
type HeightUnit = "percentageOfWidth" | "percentageOfParent" | "pixels";

class PlotlyChartsContainer extends Component<PlotlyChartsContainerProps, PlotlyChartsContainerState> {
    private subscriptionHandles: number[] = [];

    constructor(props: PlotlyChartsContainerProps) {
        super(props);

        this.state = { data: [] };
        this.handleSubscription = this.handleSubscription.bind(this);
    }

    render() {
        return createElement(PlotlyBar, {
            data: this.state.data,
            layout: {
                barmode: this.props.barMode,
                title: this.props.title
            }
        });
    }

    componentWillReceiveProps(newProps: PlotlyChartsContainerProps) {
        this.resetSubscriptions(newProps.mxObject);
        this.fetchAndProcessData(newProps.mxObject);
    }

    private resetSubscriptions(mxObject?: mendix.lib.MxObject) {
        this.subscriptionHandles.forEach(mx.data.unsubscribe);
        this.subscriptionHandles = [];

        if (mxObject) {
            this.subscriptionHandles.push(mx.data.subscribe({
                callback: this.handleSubscription,
                guid: mxObject.getGuid()
            }));
        }
    }

    private handleSubscription() {
        this.fetchAndProcessData(this.props.mxObject);
    }

    private fetchAndProcessData(mxObject?: mendix.lib.MxObject) {
        if (mxObject && this.props.seriesEntity) {
            mxObject.fetch(this.props.seriesEntity, (mxObjects: mendix.lib.MxObject[]) => {
                mxObjects.forEach(object => {
                    const seriesName = object.get(this.props.seriesNameAttribute) as string;
                    object.fetch(this.props.dataEntity, (values: mendix.lib.MxObject[]) => {
                        const fetchedData = values.map(value => {
                            return {
                                x: value.get(this.props.xValueAttribute) as Datum,
                                y: parseInt(value.get(this.props.yValueAttribute) as string, 10) as Datum
                            };
                        });

                        const series: BarData = {
                            name: seriesName,
                            type: "bar",
                            x: fetchedData.map(value => value.x),
                            y: fetchedData.map(value => value.y)
                        };

                        const data = this.state.data ? this.state.data.slice() : [];
                        data.push(series);

                        this.setState({ data });
                    });
                });
            });
        }
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
