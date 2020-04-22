import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { State } from "~/domains";
import * as actions from "~/domains/cropper/actions";

const mapStateToProps = ({ cropper }: State) => cropper;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setContainerDisplaySize: (domRect: DOMRect) =>
    dispatch(actions.setContainerDisplaySize(domRect)),
  startDrag: (referenceX: number, referenceY: number) =>
    dispatch(actions.startDrag(referenceX, referenceY)),
  resetFlags: () => dispatch(actions.resetFlags()),
  setPosition: (x: number, y: number) => dispatch(actions.setPosition(x, y)),
  startTransform: (
    referenceScale: number,
    referenceXScale: number,
    referenceYScale: number
  ) =>
    dispatch(
      actions.startTransform(referenceScale, referenceXScale, referenceYScale)
    ),
  setScale: (nextScale: number, nextScaleX: number, nextScaleY: number) =>
    dispatch(actions.setScale(nextScale, nextScaleX, nextScaleY)),
});

class Cropper extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  private ref = React.createRef<SVGSVGElement>();

  public componentDidMount = () => {
    const e = this.ref.current!;

    e.addEventListener("mousemove", this.handleOnMove, false);
    e.addEventListener("mouseup", this.handleOnResetFlags, false);
    e.addEventListener("mouseleave", this.handleOnResetFlags, false);

    this.setContainerDisplaySize();
  };

  public render = () => {
    const { image } = this.props;

    return (
      <div id="container">
        <svg
          ref={this.ref}
          viewBox={`0 0 ${image.width} ${image.height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          overflow="visible"
        >
          {this.renderTargetImage()}
          {this.renderCropper()}
        </svg>
      </div>
    );
  };

  private renderTargetImage = () => {
    const { image } = this.props;
    const { url, width, height } = image;

    return (
      <>
        <svg
          width={width}
          height={height}
          x="0"
          y="0"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          overflow="visible"
        >
          <g transform={`rotate(0, ${width / 2}, ${height / 2})`}>
            <image xlinkHref={url} width="100%" height="100%" />
            <rect width="100%" height="100%" fill="#000" fillOpacity="0.48" />
          </g>
        </svg>

        <g clipPath="url(#clip-path-1)">
          <svg
            width={width}
            height={height}
            x="0"
            y="0"
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            overflow="visible"
          >
            <g transform={`rotate(0, ${width / 2}, ${height / 2})`}>
              <image xlinkHref={url} width="100%" height="100%" />
            </g>
          </svg>
        </g>
      </>
    );
  };

  private renderCropper = () => {
    const {
      containerDisplay,
      position,
      width,
      height,
      scale,
      scaleX,
      scaleY,
      freeAspect,
    } = this.props;
    const displayRatio = containerDisplay.ratio;

    let sx = scaleX.current;
    let sy = scaleY.current;

    if (!freeAspect) {
      sx = scale.current;
      sy = scale.current;
    }

    return (
      <g>
        <clipPath id="clip-path-1">
          <rect
            x={position.x}
            y={position.y}
            width={width * sx}
            height={height * sy}
          />
        </clipPath>

        <rect
          fillOpacity="0"
          stroke="#FFF"
          strokeWidth="2"
          strokeDasharray="8 8"
          width={width * sx}
          height={height * sy}
          x={position.x}
          y={position.y}
          onMouseDown={this.handleOnMouseDown}
        ></rect>

        <circle
          fill="#FFF"
          cx={position.x + width * sx}
          cy={position.y + height * sy}
          r={12 * displayRatio}
          onMouseDown={this.handleOnMouseDownCircle}
        ></circle>
      </g>
    );
  };

  // Events

  private handleOnMouseDownCircle = (event: React.MouseEvent) => {
    const { startTransform, containerDisplay, position } = this.props;

    // cropperState.scale.previous = cropperState.scale.current;
    // cropperState.scaleX.previous = cropperState.scaleX.current;
    // cropperState.scaleY.previous = cropperState.scaleY.current;
    const scaleReference = Math.pow(
      Math.pow(
        (event.clientX - containerDisplay.x) * containerDisplay.ratio -
          position.x,
        2
      ) +
        Math.pow(
          (event.clientY - containerDisplay.y) * containerDisplay.ratio -
            position.y,
          2
        ),
      0.5
    );
    const scaleXReference =
      (event.clientX - containerDisplay.x) * containerDisplay.ratio -
      position.x;
    const scaleYReference =
      (event.clientY - containerDisplay.y) * containerDisplay.ratio -
      position.y;

    startTransform(scaleReference, scaleXReference, scaleYReference);
  };

  private handleOnMove = (event: MouseEvent) => {
    const {
      isDragging,
      setScale,
      freeAspect,
      width,
      height,
      isTransforming,
      containerDisplay,
      position,
      setPosition,
      scale,
      scaleX,
      scaleY,
    } = this.props;

    if (isDragging) {
      const relativeX =
        (event.clientX - containerDisplay.x) * containerDisplay.ratio;
      const relativeY =
        (event.clientY - containerDisplay.y) * containerDisplay.ratio;

      const nextX = relativeX - position.referenceX;
      const nextY = relativeY - position.referenceY;

      setPosition(nextX, nextY);
    } else if (isTransforming) {
      const nextScale =
        (Math.pow(
          Math.pow(
            (event.clientX - containerDisplay.x) * containerDisplay.ratio -
              position.x,
            2
          ) +
            Math.pow(
              (event.clientY - containerDisplay.y) * containerDisplay.ratio -
                position.y,
              2
            ),
          0.5
        ) /
          scale.reference) *
        scale.previous;
      const nextScaleX =
        (((event.clientX - containerDisplay.x) * containerDisplay.ratio -
          position.x) /
          scaleX.reference) *
        scaleX.previous;
      const nextScaleY =
        (((event.clientY - containerDisplay.y) * containerDisplay.ratio -
          position.y) /
          scaleY.reference) *
        scaleY.previous;

      if (freeAspect) {
        setScale(
          scale.current,
          width * nextScaleX >= 100 ? nextScaleX : scaleX.current,
          height * nextScaleY >= 100 ? nextScaleY : scaleY.current
        );
      } else {
        if (
          width * nextScale >= 100 &&
          !(
            (event.clientX - containerDisplay.x) * containerDisplay.ratio <
              position.x ||
            (event.clientY - containerDisplay.y) * containerDisplay.ratio <
              position.y
          )
        ) {
          setScale(nextScale, scaleX.current, scaleY.current);
        }
      }
    }
  };

  private handleOnMouseDown = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => {
    const { containerDisplay, position, startDrag } = this.props;
    const referenceX =
      (event.clientX - containerDisplay.x) * containerDisplay.ratio -
      position.x;
    const referenceY =
      (event.clientY - containerDisplay.y) * containerDisplay.ratio -
      position.y;
    startDrag(referenceX, referenceY);
  };

  private handleOnResetFlags = () => {
    const { resetFlags } = this.props;

    resetFlags();
  };

  //

  private setContainerDisplaySize = () => {
    const { setContainerDisplaySize } = this.props;
    const e = this.ref.current!;

    setContainerDisplaySize(e.getBoundingClientRect());
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cropper);
