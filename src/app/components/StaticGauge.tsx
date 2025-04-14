interface StaticGaugeProps {
    fearScore: number;
    segments: { label: string, start: number, end: number, color: string }[]
}


export function StaticGauge({ fearScore, segments }: StaticGaugeProps) {
    const cx = 0;
    const cy = 0;
    const r = 200;
    // const sweep = 180 * (1 + pivotUp / (r))
    const sweep = 180
    const angle = (fearScore / 100) * sweep - sweep;

    const getColor = (percent: number) => {
        return segments.findLast(val => {
            const deg = percent / 100 * 180;
            return val.start <= deg && deg <= val.end;
        })?.color
    }

    return (
        <div className="relative">
            <svg width="auto" viewBox="0 0 400 210">
                <g transform="translate(200,200)">
                    {segments.map(({ start, end, color }, i) => (
                        <path
                            key={i}
                            d={describeArc(cx, cy, r, start - 180, end - 180)}
                            fill={color}

                        />
                    ))}
                </g>


                <g transform="translate(200,200)">
                    {segments.map(({ label, start, end }, i) => {
                        const midAngle = ((start + end) / 2) - 90;

                        return (
                            <text
                                key={i}
                                textAnchor="middle"
                                fontSize="14"
                                fontWeight="bold"
                                fill="black"
                                transform={`rotate(${midAngle}) translate(0,${20 - r})`}
                            // transform={`rotate(${(start + end) / 2})`}
                            >
                                {label}
                            </text>
                        );
                    })}
                </g>

                <g transform="translate(200,100)">
                    <text textAnchor="middle" fill={getColor(fearScore)} fontWeight="bold">{(fearScore / 100).toLocaleString("en-US", {
                        style: "percent"
                    })}</text>
                </g>

                <g transform="translate(200,200)">
                    <circle r={4} fill="black" />
                </g>
                <g>
                    <line transform={`translate(200,200) rotate(${angle})`} x1="0" y1="0" x2="135" y2="0" strokeWidth="3" stroke="black" strokeLinecap="round" />
                </g>
            </svg>

            {/* Value */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl" style={{ color: getColor(fearScore) }}>

            </span>

        </div >
    );
}

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad),
    };
}

/*
describeArc(100, 100, 180, 0-180, 30-180)
start = polarToCartesian(100, 100, 180, -150)
-> angleRad = (-150 * pi) / 180
-> x = 100 + 180 * cos((-150 * pi) / 180)
-> y = 100 + 180 * sin((-150 * pi) / 180)
end = polarToCartesian(100, 100, 180, -180)
-> angleRad = (-180 * pi) / 180
-> x = 100 + 180 * cos((-180 * pi) / 180)
-> y = 100 + 180 * sin((-180 * pi) / 180)
*/


export function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const startOuter = polarToCartesian(cx, cy, r, startAngle);
    const endOuter = polarToCartesian(cx, cy, r, endAngle);
    const inner_r = r - 30;
    const startInner = polarToCartesian(cx, cy, inner_r, startAngle);
    const endInner = polarToCartesian(cx, cy, inner_r, endAngle)

    return `M ${startOuter.x} ${startOuter.y} A ${r} ${r} 0 0 1 ${endOuter.x} ${endOuter.y} L ${endInner.x} ${endInner.y} A ${inner_r} ${inner_r} 0 0 0 ${startInner.x} ${startInner.y} Z`;
}
