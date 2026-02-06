import img from "../assets/icon-loading.svg";

export default function LoadingSpinner(){
    return (
        <div className="loading-container">
            <div className="loading-spinner">
                <div className="spinner">
                    <img src={img} alt="" />
                </div>
                <p className="loading-text">Searching for the city</p>
            </div>
        </div>
    );
}