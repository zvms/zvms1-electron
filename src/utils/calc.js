
export function isTimeFinished(id, time) {
    // 义工时间上限；2021届以后有变动
    let vim = 24, vom = 20, vlm = 16;
    if (id > 20210000) { vim = 30; vom = 16; vlm = 18; }

    let inside = stus[i].inside / 60.0;
    let outside = stus[i].outside / 60.0;
    let large = stus[i].large / 60.0;
    let result = true;
    if (outside < vom) { // 溢出判满机制：校内除二当校外
        inside = inside - (vom - outside) * 2;
        outside = vom;
    }
    if (large < vlm || inside < vim || outside < vom || inside + outside < vim + vom) {
        result = false;
    }
    return result;
}

