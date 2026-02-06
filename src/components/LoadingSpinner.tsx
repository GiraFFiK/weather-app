export default function LoadingSpinner(){
    return (
        <div className="loading-container">
            <div className="loading-spinner">
                <div className="spinner">
                    <img src=".\src\assets\icon-loading.svg" alt="" />
                </div>
                <p className="loading-text">Searching for the city</p>
            </div>
        </div>
    );
}