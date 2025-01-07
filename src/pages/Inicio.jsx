const Inicio =()=>{
    return(
        <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono">
        <div className="m-4 mt-[60px]">
          <h2 className="text-[30px] text-center">BIENVEDIO AL CONTROL DE EMPLEADOS</h2>
        </div>
        <div className="flex flex-col items-center gap-4 bg-slate-300 h-[430px] w-[330px] rounded-xl p-4 text-[15px]">
          
  
          <div className="w-[300px] flex flex-col items-center font-mono">
            <div className="w-full text-center">
              <p className="mb-2 text-[25px]">¿Que es el control de empleados?</p>
              <p className="mt-[20px] text-[20px]">
                Es una aplicación que permite llevar un control de los empleados de una empresa, con mayor eficiente y facilidad. En la cual puedes llevar diariamente un control de los horarios y las tarifas de cada empleado
              </p>
            </div>           
          </div>
          
        </div>
      </div>
    )
}
export default Inicio;