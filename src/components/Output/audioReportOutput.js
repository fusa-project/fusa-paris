
const AudioReportOutput = ({ output }) => {
    return (
        <div>
            <h2>De acuerdo al audio:</h2>
            <ul>
                {output.map((text, i) => (
                    <li key={i}>{text}</li>
                ))}
            </ul>

        </div>
    );
}

export default AudioReportOutput