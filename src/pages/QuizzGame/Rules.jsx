function Rules({ limitScore, setLimitScore, limitTime, setLimitTime, seeOtherAnswers, setSeeOtherAnswers, acceptShortcuts, setAcceptShortcuts, rulesVisible }) {
    return (
        <div className={rulesVisible ? "block p-6 bg-white rounded-lg shadow-md h-screen w-1/3" : "hidden"}>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Règles</h1>

            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Limite de score: {limitScore}</label>
                <input
                    type="range"
                    min="50"
                    max="500"
                    value={limitScore}
                    onChange={(e) => setLimitScore(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Limite de temps (secondes): {limitTime}</label>
                <input
                    type="range"
                    min="5"
                    max="30"
                    value={limitTime}
                    onChange={(e) => setLimitTime(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Voir les réponses des autres:</label>
                <div className="flex items-center">
                    <label className="mr-4 flex items-center">
                        <input
                            type="radio"
                            name="seeOtherAnswers"
                            value="true"
                            checked={seeOtherAnswers === true}
                            onChange={() => setSeeOtherAnswers(true)}
                            className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                        />
                        <span className="ml-2 text-gray-700">Oui</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="seeOtherAnswers"
                            value="false"
                            checked={seeOtherAnswers === false}
                            onChange={() => setSeeOtherAnswers(false)}
                            className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                        />
                        <span className="ml-2 text-gray-700">Non</span>
                    </label>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Accepter les raccourcis:</label>
                <div className="flex items-center">
                    <label className="mr-4 flex items-center">
                        <input
                            type="radio"
                            name="acceptShortcuts"
                            value="true"
                            checked={acceptShortcuts === true}
                            onChange={() => setAcceptShortcuts(true)}
                            className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                        />
                        <span className="ml-2 text-gray-700">Oui</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="acceptShortcuts"
                            value="false"
                            checked={acceptShortcuts === false}
                            onChange={() => setAcceptShortcuts(false)}
                            className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                        />
                        <span className="ml-2 text-gray-700">Non</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default Rules;
