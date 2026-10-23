#!/bin/sh
# Converts screenshots and screen recordings into web-friendly files for the handbook.
#
#   tools/convert-media.sh <input folder> [output folder]
#
# Images (.png, .jpg) become .webp, and videos (.mov, .mp4) become silent, looping-friendly
# .webm (VP9). Both are scaled down to at most 1400px wide (2x the 650px page layout width,
# so they stay sharp on high-density screens). The output folder defaults to
# content/media/screenshots. Video sizes are written to content/media/video-sizes.json,
# which eleventy.config.js reads to lay videos out before they load.
#
# Needs ffmpeg, ffprobe, and cwebp (brew install ffmpeg webp).

set -e

IN="$1"
OUT="${2:-content/media/screenshots}"
MAX_WIDTH=1400

if [ -z "$IN" ]; then
    echo "usage: tools/convert-media.sh <input folder> [output folder]" >&2
    exit 1
fi
mkdir -p "$OUT"

for file in "$IN"/*; do
    name=$(basename "$file")
    base="${name%.*}"
    case "$(echo "$name" | tr '[:upper:]' '[:lower:]')" in
        *.png|*.jpg|*.jpeg)
            width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$file")
            resize=""
            if [ "$width" -gt "$MAX_WIDTH" ]; then resize="-resize $MAX_WIDTH 0"; fi
            cwebp -quiet -q 82 $resize "$file" -o "$OUT/$base.webp"
            echo "image  $name -> $base.webp"
            ;;
        *.mov|*.mp4)
            ffmpeg -loglevel error -y -i "$file" -an \
                -vf "fps=30,scale='min($MAX_WIDTH,iw)':-2" \
                -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 -deadline good \
                "$OUT/$base.webm"
            echo "video  $name -> $base.webm"
            ;;
    esac
done

# record each video's size (published path -> [width, height])
SIZES="content/media/video-sizes.json"
printf "{\n" > "$SIZES"
first=1
for video in content/media/*.webm content/media/*/*.webm; do
    [ -e "$video" ] || continue
    size=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=, "$video")
    [ $first -eq 1 ] || printf ",\n" >> "$SIZES"
    printf '    "/%s": [%s]' "${video#content/}" "$size" >> "$SIZES"
    first=0
done
printf "\n}\n" >> "$SIZES"
