/**
 * Type declarations for react-native-android-widget
 * These will be overridden when the package is installed
 */

declare module 'react-native-android-widget' {
  import { ReactNode, FC } from 'react';

  export interface FlexWidgetStyle {
    height?: number | string;
    width?: number | string;
    backgroundColor?: string;
    borderRadius?: number;
    padding?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    flexDirection?: 'row' | 'column';
    alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
    justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around';
    flex?: number;
    borderWidth?: number;
    borderColor?: string;
  }

  export interface TextWidgetStyle {
    fontSize?: number;
    fontWeight?: '400' | '500' | '600' | '700' | 'bold' | 'normal';
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
  }

  export interface FlexWidgetProps {
    style?: FlexWidgetStyle;
    clickAction?: string;
    clickActionData?: Record<string, unknown>;
    children?: ReactNode;
  }

  export interface TextWidgetProps {
    text: string;
    style?: TextWidgetStyle;
    truncate?: 'END' | 'START' | 'MIDDLE';
    maxLines?: number;
  }

  export interface OverlapWidgetProps {
    style?: FlexWidgetStyle;
    children?: ReactNode;
  }

  export interface SvgWidgetProps {
    svg: string;
    style?: {
      width?: number;
      height?: number;
    };
  }

  export const FlexWidget: FC<FlexWidgetProps>;
  export const TextWidget: FC<TextWidgetProps>;
  export const OverlapWidget: FC<OverlapWidgetProps>;
  export const SvgWidget: FC<SvgWidgetProps>;

  export function registerWidgetTaskHandler(
    handler: (props: {
      widgetName: string;
      widgetAction: string;
      clickAction?: string;
      clickActionData?: Record<string, unknown>;
      widgetInfo?: {
        widgetId: number;
        width: number;
        height: number;
      };
    }) => Promise<ReactNode | null>
  ): void;

  export function requestWidgetUpdate(widgetName: string): void;
  export function requestWidgetUpdateById(widgetId: number): void;
}
