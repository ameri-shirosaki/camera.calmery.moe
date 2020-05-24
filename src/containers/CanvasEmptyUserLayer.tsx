import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { State } from "~/domains";
import { Colors } from "~/styles/colors";
import { CanvasUserLayerFrame } from "~/types/CanvasUserLayerFrame";
import { thunkActions } from "~/domains/canvas/actions";
import { getImageFile } from "~/utils/get-image-file";
import { CanvasStickerLayerBorder } from "~/components/CanvasStickerLayerBorder";

export const CanvasEmptyUserLayer: React.FC<{
  frame: CanvasUserLayerFrame;
  index: number;
}> = (props) => {
  const dispatch = useDispatch();
  const { frame, index } = props;
  const { displayMagnification, stickerLayers } = useSelector(
    ({ canvas }: State) => canvas
  );

  const handOnClickEmptyUserImage = useCallback(async () => {
    dispatch(
      thunkActions.addCanvasUserLayerFromFile(await getImageFile(), index)
    );
  }, [dispatch, index]);

  const stickerLayer = stickerLayers[stickerLayers.length - 1];

  return (
    <>
      <svg
        x={frame.x}
        y={frame.y}
        width={frame.width}
        height={frame.height}
        viewBox={`0 0 ${frame.width} ${frame.height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {frame.path && (
          <clipPath id={`canvas-user-layer-filter-${index}`}>
            <path d={frame.path} />
          </clipPath>
        )}

        <g clipPath={`url(#canvas-user-layer-filter-${index})`}>
          <g onClick={handOnClickEmptyUserImage}>
            <rect
              x="0"
              y="0"
              width={frame.width}
              height={frame.height}
              fill="#fff"
              style={{ cursor: "pointer" }}
            ></rect>
            <svg
              width="128"
              height="96"
              viewBox="0 0 128 96"
              x={frame.width / 2 - 64}
              y={frame.height / 2 - 48}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M36.7059 29.2717C36.7059 26.8671 35.8543 24.8324 34.1513 23.1676C32.5378 21.4104 30.5658 20.5318 28.2353 20.5318C25.9048 20.5318 23.9328 21.4104 22.3193 23.1676C20.7059 24.8324 19.8992 26.8671 19.8992 29.2717C19.8992 31.6763 20.7059 33.711 22.3193 35.3757C23.9328 37.0405 25.9048 37.8728 28.2353 37.8728C30.5658 37.8728 32.5378 37.0405 34.1513 35.3757C35.8543 33.711 36.7059 31.6763 36.7059 29.2717ZM20.0336 78.659H108.504C109.49 78.659 110.297 78.3353 110.924 77.6879C111.552 77.0405 111.866 76.2081 111.866 75.1907V73.526C111.866 72.6012 111.597 71.5838 111.059 70.474C110.611 69.3642 110.073 68.4393 109.445 67.6994L80.6723 37.8728C79.9552 37.1329 79.1485 36.763 78.2521 36.763C77.4454 36.763 76.6835 37.1329 75.9664 37.8728L49.8824 64.7861C49.1653 65.526 48.3585 65.896 47.4622 65.896C46.5658 65.896 45.7591 65.526 45.042 64.7861L39.9328 59.5144C39.2157 58.7746 38.409 58.4046 37.5126 58.4046C36.7059 58.4046 35.944 58.7746 35.2269 59.5144L18.958 76.1619C18.2409 76.8093 17.972 77.4104 18.1513 77.9653C18.4202 78.4277 19.0476 78.659 20.0336 78.659ZM117.916 82.1272V13.8728C117.916 12.8555 117.602 12.0231 116.975 11.3757C116.347 10.7283 115.541 10.4046 114.555 10.4046H13.4454C12.4594 10.4046 11.6527 10.7283 11.0252 11.3757C10.3978 12.0231 10.084 12.8555 10.084 13.8728V82.1272C10.084 83.1445 10.3978 83.9769 11.0252 84.6243C11.6527 85.2717 12.4594 85.5954 13.4454 85.5954H114.555C115.541 85.5954 116.347 85.2717 116.975 84.6243C117.602 83.9769 117.916 83.1445 117.916 82.1272ZM6.31933 0H121.681C123.473 0 124.952 0.647399 126.118 1.9422C127.373 3.23699 128 4.80925 128 6.65896V89.341C128 91.1907 127.373 92.763 126.118 94.0578C124.952 95.3526 123.473 96 121.681 96H6.31933C4.52661 96 3.0028 95.3526 1.7479 94.0578C0.582633 92.763 0 91.1907 0 89.341V6.65896C0 4.80925 0.582633 3.23699 1.7479 1.9422C3.0028 0.647399 4.52661 0 6.31933 0Z"
                fill={Colors.gray}
              />
            </svg>
          </g>
          {stickerLayer && (
            <CanvasStickerLayerBorder
              baseX={frame.x}
              baseY={frame.y}
              displayMagnification={displayMagnification}
              stickerLayer={stickerLayer}
              backgroundBrightness={1}
            />
          )}
        </g>
      </svg>
      <svg
        x={frame.x}
        y={frame.y}
        width={frame.width}
        height={frame.height}
        viewBox={`0 0 ${frame.width} ${frame.height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        overflow="visible"
      >
        <path
          d={frame.path}
          fill="none"
          stroke={Colors.gray}
          strokeWidth={displayMagnification}
          strokeDasharray="8 8"
        />
      </svg>
    </>
  );
};
