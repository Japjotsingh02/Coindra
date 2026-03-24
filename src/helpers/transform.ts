const transform = (data: any[]) => {
    return data.map((k) => ({
        date: k.date || (k.openTime ? new Date(k.openTime).toISOString().split("T")[0] : ""),
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
        volume: k.volume,
    }));
}

export default transform;