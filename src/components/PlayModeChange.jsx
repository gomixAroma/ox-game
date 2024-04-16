import style from './../assets/styles/PlayModeChange.module.scss'

const PlayModeChange = () => {
    // 一時的に非表示
    const visible = false;
    if (!visible) return null;

    return (
        <div className={style.playChange}>
            <div className={`text-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" strokeWidth="2.5" stroke="black" fill="none" style={{ width: "48px", height: "48px" }}><circle cx="22.83" cy="22.57" r="7.51"></circle><path d="M38 49.94a15.2 15.2 0 00-15.21-15.2h0a15.2 15.2 0 00-15.2 15.2z"></path><circle cx="44.13" cy="27.22" r="6.05"></circle><path d="M42.4 49.94h14A12.24 12.24 0 0044.13 37.7h0a12.21 12.21 0 00-5.75 1.43"></path></svg>
            </div>
            <div>PlayModeChange</div>
        </div>
    )
}

export default PlayModeChange
