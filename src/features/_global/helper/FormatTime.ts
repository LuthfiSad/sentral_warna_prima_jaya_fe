interface IFormatDate {
    year: "numeric" | "2-digit"
    month: "numeric" | "2-digit" | "long" | "short" | "narrow"
    day: "numeric" | "2-digit"

}

interface IFormatTime {
    hour: "numeric" | "2-digit"
    minute: "numeric" | "2-digit"
}



export function formatDate(isoDate: Date) {
    const date = new Date(isoDate);

    const optionsDate: IFormatDate = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    };

    const optionsTime: IFormatTime = {
        hour: '2-digit',
        minute: '2-digit'
    };

    const formattedDate = date.toLocaleDateString('id-ID', optionsDate);
    const formattedTime = date.toLocaleTimeString('id-ID', optionsTime);

    return `${formattedDate}, ${formattedTime}`;
}