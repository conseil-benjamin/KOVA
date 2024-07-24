function Header() {
  return (
        <div className={'flex justify-between'}>
            <div className={'pl-5 m-2'}>
                <h1 className={'text-center text-white text-4xl'}>KOVA</h1>
            </div>
            <div className={'flex flex-row pr-5'}>
                <p className={'text-white m-2 p-2 cursor-pointer'}>S'inscrire</p>
                <p className={'bg-purple-400 rounded-md p-2 text-black m-2 cursor-pointer'}>Se connecter</p>
            </div>
        </div>
  )
}

export default Header
