var documenterSearchIndex = {"docs":
[{"location":"api/#General-remarks","page":"API","title":"General remarks","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"All physical quantities are assumed to be consistently represented through their values expressed in basic SI units (m, kg, s, A, K, mol, cd), supported by the LessUnitful.jl package built on top of Unitful.jl.","category":"page"},{"location":"api/#Electrolyte-data","page":"API","title":"Electrolyte data","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"ElectrolyteData\nAbstractElectrolyteData\ndlcap0(::ElectrolyteData)\ndebyelength(::ElectrolyteData)\nchemical_potentials!\nrrate","category":"page"},{"location":"api/#LiquidElectrolytes.ElectrolyteData","page":"API","title":"LiquidElectrolytes.ElectrolyteData","text":"mutable struct ElectrolyteData <: AbstractElectrolyteData\n\nData for electrolyte. It is defined using Parameters.jl, therefore it has keyword constructors like\n\n    ElectrolyteData(nc=3,z=[-1,2,1])\n\nnc::Int64\nNumber of ionic species. Default: 2\niϕ::Int64\nPotential index in species list. Default: nc + 1\nip::Int64\nPressure index in species list Default: nc + 2\nD::Vector{Float64}\nMobility coefficient Default: fill(2.0e-9 * ufac\"m^2/s\", nc)\nz::Vector{Int64}\nCharge numbers of ions Default: [(-1) ^ (i - 1) for i = 1:nc]\nM0::Float64\nMolar weight of solvent Default: 18.0153 * ufac\"g/mol\"\nM::Vector{Float64}\nMolar weight of ions Default: fill(M0, nc)\nv0::Float64\nMolar volume of solvent Default: 1 / (55.4 * ufac\"M\")\nv::Vector{Float64}\nMolar volumes of ions Default: fill(v0, nc)\nκ::Vector{Float64}\nSolvation numbers Default: fill(10.0, nc)\nc_bulk::Vector{Float64}\nBulk ion concentrations Default: fill(0.1 * ufac\"M\", nc)\nϕ_bulk::Float64\nBulk voltage Default: 0.0 * ufac\"V\"\np_bulk::Float64\nBulk pressure Default: 0.0 * ufac\"Pa\"\nΓ_bulk::Int64\nBulk boundary number Default: 2\nϕ_we::Float64\nWorking electrode voltage Default: 0.0 * ufac\"V\"\nΓ_we::Int64\nWorking electrode  boundary number Default: 1\nT::Float64\nTemperature Default: (273.15 + 25) * ufac\"K\"\nRT::Float64\nMolar gas constant scaled with temperature Default: ph\"R\" * T\nF::Float64\nFaraday constant Default: ph\"N_A*e\"\nε::Float64\nDielectric permittivity of solvent Default: 78.49\nε_0::Float64\nDielectric permittivity of vacuum Default: ph\"ε_0\"\npscale::Float64\nPressure scaling factor Default: 1.0e9\neneutral::Bool\nLocal electroneutrality switch Default: false\nscheme::Symbol\nFlux caculation scheme This allows to choose between\n:μex (default): excess chemical potential (SEDAN) scheme, see sflux\n:act : scheme based on reciprocal activity coefficients, see aflux\n:cent : central scheme, see cflux.\nDefault: :μex\nepsreg::Float64\nRegularization parameter used in rlog  Default: 1.0e-20\n\n\n\n\n\n","category":"type"},{"location":"api/#LiquidElectrolytes.AbstractElectrolyteData","page":"API","title":"LiquidElectrolytes.AbstractElectrolyteData","text":"abstract type AbstractElectrolyteData\n\nAbstract super type for electrolytes\n\n\n\n\n\n","category":"type"},{"location":"api/#LiquidElectrolytes.dlcap0-Tuple{ElectrolyteData}","page":"API","title":"LiquidElectrolytes.dlcap0","text":"dlcap0(electrolyte)\n\nDouble layer capacitance at zero voltage for symmetric binary electrolyte.\n\nExample\n\nusing LessUnitful\nely = ElectrolyteData(c_bulk=fill(0.01ufac\"mol/dm^3\",2))\nround(dlcap0(ely),sigdigits=5) |> u\"μF/cm^2\"\n# output\n\n22.847 μF cm^-2\n\n\n\n\n\n","category":"method"},{"location":"api/#LiquidElectrolytes.debyelength-Tuple{ElectrolyteData}","page":"API","title":"LiquidElectrolytes.debyelength","text":"debyelength(electrolyte)\n\nDebye length.\n\nusing LessUnitful\nely = ElectrolyteData(c_bulk=fill(0.01ufac\"mol/dm^3\",2))\nround(debyelength(ely),sigdigits=5) |> u\"nm\"\n# output\n\n4.3018 nm\n\n\n\n\n\n","category":"method"},{"location":"api/#LiquidElectrolytes.chemical_potentials!","page":"API","title":"LiquidElectrolytes.chemical_potentials!","text":"chemical_potentials!(μ,u,electrolyte)\n\nCalculate chemical potentials from concentrations.\n\nInput:\n\nμ: memory for result (will be filled)\nu: local solution vector (concentrations, potential, pressure)\n\nReturns μ0, μ: chemical potential of solvent and chemical potentials of ions.\n\nusing LessUnitful\nely = ElectrolyteData(c_bulk=fill(0.01ufac\"mol/dm^3\",2))\nμ0,μ=chemical_potentials!([0.0,0.0],vcat(ely.c_bulk,[0,0]),ely)\nround(μ0,sigdigits=5),round.(μ,sigdigits=5)\n# output\n\n(-0.89834, [-21359.0, -21359.0])\n\n\n\n\n\n","category":"function"},{"location":"api/#LiquidElectrolytes.rrate","page":"API","title":"LiquidElectrolytes.rrate","text":"rrate(R0,β,A)\n\nReaction rate expression\n\nrrate(R0,β,A)=R0*(exp(-β*A) - exp((1-β)*A))\n\n\n\n\n\n","category":"function"},{"location":"api/#Discretization-system","page":"API","title":"Discretization system","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"PNPSystem\npnpunknowns\nelectrolytedata\nsolventconcentration","category":"page"},{"location":"api/#LiquidElectrolytes.PNPSystem","page":"API","title":"LiquidElectrolytes.PNPSystem","text":"PNPSystem(grid;\n         celldata=ElectrolyteData(),\n         bcondition=default_bcondition,\n         kwargs...)\n\nCreate VoronoiFVM system. Input:\n\ngrid: discretization grid\ncelldata: composite struct containing electrolyte data\nbcondition: boundary condition\nkwargs: Keyword arguments of VoronoiFVM.System\n\n\n\n\n\n","category":"function"},{"location":"api/#LiquidElectrolytes.pnpunknowns","page":"API","title":"LiquidElectrolytes.pnpunknowns","text":"pnpunknowns(sys)\n\nReturn vector of unknowns initialized with bulk data.\n\n\n\n\n\n","category":"function"},{"location":"api/#LiquidElectrolytes.electrolytedata","page":"API","title":"LiquidElectrolytes.electrolytedata","text":"electrolytedata(sys)\n\nExtract electrolyte data from system.\n\n\n\n\n\n","category":"function"},{"location":"api/#LiquidElectrolytes.solventconcentration","page":"API","title":"LiquidElectrolytes.solventconcentration","text":"   solventconcentration(U::Array, electrolyte)\n\nCalculate vector of solvent concentrations from solution array.\n\n\n\n\n\n","category":"function"},{"location":"api/#Standard-calculations","page":"API","title":"Standard calculations","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"bulkbcondition\ndlcapsweep\nivsweep","category":"page"},{"location":"api/#LiquidElectrolytes.bulkbcondition","page":"API","title":"LiquidElectrolytes.bulkbcondition","text":"bulkbcondition(f,u,bnode,electrolyte)\n\nBulk boundary condition for electrolyte: set potential, pressure and concentrations to bulk values.\n\n\n\n\n\n","category":"function"},{"location":"api/#LiquidElectrolytes.dlcapsweep","page":"API","title":"LiquidElectrolytes.dlcapsweep","text":"       dlcapweep(sys;voltages=(-1:0.1:1)*ufac\"V\",\n                              δ=1.0e-4,\n                              molarity=0.1*ufac\"mol/dm^3\",\n                              solver_kwargs...)\n\nCalculate double layer capacitances for voltages given in voltages. Returns vector of voltages and vector of double layer capacitances.\n\nAssumptions:\n\nOnly one double layer in the system - close to working electrode\n1D domain\n\n\n\n\n\n","category":"function"},{"location":"api/#LiquidElectrolytes.ivsweep","page":"API","title":"LiquidElectrolytes.ivsweep","text":"   ivsweep(sys;\n              voltages=(-0.5:0.1:0.5)*ufac\"V\",\n                             ispec=1,\n                             solver_kwargs...)\n\nCalculate working electrode current corresponding to rate for species ispec for each voltage in voltages. Returns vector of voltages   and vector of currents.\n\n\n\n\n\n","category":"function"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"EditURL = \"https://github.com/j-fu/LiquidElectrolytes.jl/blob/main/examples/Example110_Fe23Cell.jl\"","category":"page"},{"location":"examples/Example110_Fe23Cell/#Fe-redox-half-cell","page":"Fe redox half cell","title":"Fe redox half cell","text":"","category":"section"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"(source code)","category":"page"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"I-V sweep for Fe^2+ to Fe^2+ + e^-","category":"page"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"Methods called:","category":"page"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"ElectrolyteData\nivsweep\ndlcapsweep\nPNPSystem","category":"page"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"module Example110_Fe23Cell\nusing Unitful\nusing LessUnitful\nusing ExtendableGrids,GridVisualize\nusing VoronoiFVM\nusing LiquidElectrolytes\nusing PyPlot,Colors, Parameters\nusing StaticArrays\n\n\nfunction main(;nref=0,\n              compare=false,\n              eneutral=false,\n              voltages=(-1:0.005:1)*ufac\"V\",\n              dlcap=false,\n              R0=1.0e-6,\n              molarities=[0.001,0.01,0.1,1],\n              scheme=:μex,\n              xmax=0.5,\n              κ=10.0,\n              Plotter=PyPlot,\n              kwargs...)\n\n    @local_phconstants N_A e R ε_0\n    F=N_A*e\n    @local_unitfactors cm μF mol dm s mA A nm\n\n\n\n    defaults=(; max_round=3,\n              tol_round=1.0e-9,\n              verbose=false,\n              tol_relative=1.0e-5,\n              tol_mono=1.0e-10)\n\n    kwargs=merge(defaults, kwargs)\n\n    hmin=1.0e-1*nm*2.0^(-nref)\n    hmax=1.0*nm*2.0^(-nref)\n    L=20.0*nm\n    X=geomspace(0,L,hmin,hmax)\n    grid=simplexgrid(X)\n\n\n    R0=R0*ufac\"mol/(cm^2*s)\"\n    Δg=0.0\n    β=0.5\n    ihplus=1\n    ife2=2\n    ife3=3\n    iso4=4\n\n    function halfcellbc(f,u,bnode,data)\n        @unpack iϕ,nc,Γ_we, Γ_bulk,ϕ_we,eneutral=data\n        bulkbcondition(f,u,bnode,data;region=Γ_bulk)\n        if bnode.region==Γ_we\n            if !data.eneutral\n                boundary_dirichlet!(f,u,bnode;species=iϕ,region=Γ_we,value=ϕ_we)\n            end\n            μ0,μ=chemical_potentials!(MVector{4,eltype(u)}(undef),u,data)\n            A=(μ[ife2]-μ[ife3]+Δg - eneutral*F*(u[iϕ]-ϕ_we))/(R*data.T)\n            r=rrate(R0,β,A)\n            f[ife2]-=r\n            f[ife3]+=r\n        end\n    end\n\n\n    celldata=ElectrolyteData(;nc=4,\n                             z=[1,2,3,-2],\n                             eneutral,\n                             κ=fill(κ,4),\n                             Γ_we=1,\n                             Γ_bulk=2,\n                             scheme)\n    @unpack iϕ,ip=celldata\n\n    celldata.c_bulk[ihplus]=1.0*mol/dm^3\n    celldata.c_bulk[ife2]=0.1*mol/dm^3\n    celldata.c_bulk[ife3]=0.1*mol/dm^3\n    celldata.c_bulk[iso4]=0.75*mol/dm^3\n\n    @assert isapprox(celldata.c_bulk'*celldata.z,0, atol=1.0e-12)\n\n    cell=PNPSystem(grid;bcondition=halfcellbc,celldata)\n    check_allocs!(cell,false)\n\n    # Compare electroneutral and double layer cases\n    if compare\n\n        celldata.eneutral=false\n\tvolts,currs, sols=ivsweep(cell;voltages,ispec=ife2,kwargs...)\n\n        celldata.eneutral=true\n        nvolts,ncurrs, nsols=ivsweep(cell;voltages,ispec=ife2,kwargs...)\n\n        vis=GridVisualizer(;Plotter,resolution=(600,400),clear=true,legend=:lt,xlabel=\"Δϕ/V\",ylabel=\"I/(A/m^2)\")\n        scalarplot!(vis,volts,-currs,color=\"red\",markershape=:utriangle,markersize=7, markevery=10,label=\"PNP\")\n        scalarplot!(vis,nvolts,-ncurrs,clear=false,color=:green,markershape=:none,label=\"NNP\")\n        return reveal(vis)\n    end\n\n\n    # Calculate double layer capacitances\n    if dlcap\n\n        vis=GridVisualizer(;Plotter,resolution=(500,300),legend=:rt,clear=true,xlabel=\"φ/V\",ylabel=\"C_dl/(μF/cm^2)\")\n        hmol=1/length(molarities)\n        for imol=1:length(molarities)\n            color=RGB(1-imol/length(molarities),0,imol/length(molarities))\n\t    volts,caps=dlcapsweep(cell;voltages,molarity=molarities[imol],kwargs...)\n\t    scalarplot!(vis,volts,caps/(μF/cm^2);\n                        color,\n\t\t        clear=false,\n                        label=\"$(molarities[imol])M\")\n        end\n        return  reveal(vis)\n    end\n\n    # Full calculation\n\n    volts,currs, sols=ivsweep(cell;voltages,ispec=ife2,kwargs...)\n\n    tsol=VoronoiFVM.TransientSolution(sols,volts)\n\n    for it=1:length(tsol.t)\n        tsol.u[it][ife2,:]/=mol/dm^3\n        tsol.u[it][ife3,:]/=mol/dm^3\n    end\n\n    xmax=xmax*nm\n    xlimits=[0,xmax]\n    vis=GridVisualizer(;Plotter,resolution=(1200,400),layout=(1,5),clear=true)\n    aspect=3.5*xmax/(tsol.t[end]-tsol.t[begin])\n    scalarplot!(vis[1,1],F*currs/(mA/cm^2),volts,markershape=:none,title=\"IV\",xlabel=\"I\",ylabel=\"ϕ\")\n    scalarplot!(vis[1,2],cell,tsol;species=ife2,aspect,xlimits,title=\"Fe2+\",colormap=:summer,ylabel=\"ϕ\")\n    scalarplot!(vis[1,3],cell,tsol;species=ife3,aspect,xlimits,title=\"Fe3+\",colormap=:summer,ylabel=\"ϕ\")\n    scalarplot!(vis[1,4],cell,tsol;species=iϕ,aspect,xlimits,title=\"ϕ\",colormap=:bwr,ylabel=\"ϕ\")\n    scalarplot!(vis[1,5],cell,tsol;species=ip,aspect,xlimits,title=\"p\",colormap=:summer,ylabel=\"ϕ\")\n\n    reveal(vis)\nend\n\nend","category":"page"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"Example110_Fe23Cell.main()","category":"page"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"Example110_Fe23Cell.main(compare=true)","category":"page"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"","category":"page"},{"location":"examples/Example110_Fe23Cell/","page":"Fe redox half cell","title":"Fe redox half cell","text":"This page was generated using Literate.jl.","category":"page"},{"location":"internal/#Electrolyte-data","page":"Internal API","title":"Electrolyte data","text":"","category":"section"},{"location":"internal/","page":"Internal API","title":"Internal API","text":"LiquidElectrolytes.charge\nLiquidElectrolytes.vrel\nLiquidElectrolytes.c0_barc\nLiquidElectrolytes.rlog\nLiquidElectrolytes.rexp\nLiquidElectrolytes.wnorm","category":"page"},{"location":"internal/#LiquidElectrolytes.charge","page":"Internal API","title":"LiquidElectrolytes.charge","text":"charge(c,electrolyte)\n\nCalculate charge from vector of concentrations\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.vrel","page":"Internal API","title":"LiquidElectrolytes.vrel","text":"vrel(ic,electrolyte)\n\nCalculate relative (wrt. solvent) molar volume of i-th species v_irel=κ_i+fracv_iv_0.\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.c0_barc","page":"Internal API","title":"LiquidElectrolytes.c0_barc","text":"c0_barc(u,electrolyte)\n\nCalculate solvent concentration c_0 and summary concentration bar c from vector of concentrations c using the incompressibility constraint (assuming κ_0=0):\n\n sum_i=0^N c_i (v_i + κ_iv_0) =1\n\nThis gives\n\n c_0v_0=1-sum_i=1^N c_i (v_i+ κ_iv_0)\n\nc_0= 1v_0 - sum_i=1^N c_i(fracv_iv_0+κ)\n\nThen we can calculate \n\n bar c= sum_i=0^N c_i\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.rlog","page":"Internal API","title":"LiquidElectrolytes.rlog","text":"rlog(u, electrolyte)\n\nCalls rlog(u;eps=electrolyte.epsreg)\n\n\n\n\n\nrlog(u; eps=1.0e-20)\n\nRegularized logarithm. Smooth linear continuation for x<eps. This means we can calculate a \"logarithm\"  of a small negative number.\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.rexp","page":"Internal API","title":"LiquidElectrolytes.rexp","text":"rexp(x;trunc=500.0)\n\nRegularized exponential. Linear continuation for x>trunc,   returns 1/rexp(-x) for x<trunc.\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.wnorm","page":"Internal API","title":"LiquidElectrolytes.wnorm","text":"wnorm(u,w,p)\n\nWeighted norm with respect to columns\n\n\n\n\n\n","category":"function"},{"location":"internal/#Finite-volume-system","page":"Internal API","title":"Finite volume system","text":"","category":"section"},{"location":"internal/","page":"Internal API","title":"Internal API","text":"LiquidElectrolytes.pnpstorage\nLiquidElectrolytes.pnpreaction\nLiquidElectrolytes.default_bcondition\nLiquidElectrolytes.pnpflux\nLiquidElectrolytes.sflux\nLiquidElectrolytes.aflux\nLiquidElectrolytes.cflux\nLiquidElectrolytes.dμex","category":"page"},{"location":"internal/#LiquidElectrolytes.pnpstorage","page":"Internal API","title":"LiquidElectrolytes.pnpstorage","text":"pnpstorage(f, u, node, electrolyte)\n\nFinite volume storage term\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.pnpreaction","page":"Internal API","title":"LiquidElectrolytes.pnpreaction","text":"pnpreaction(f, u, node, electrolyte)\n\nFinite volume reaction term\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.default_bcondition","page":"Internal API","title":"LiquidElectrolytes.default_bcondition","text":"default_bcondition(f,u,bnode,electrolyte)\n\nDefault boundary condition amounts to nothing\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.pnpflux","page":"Internal API","title":"LiquidElectrolytes.pnpflux","text":"pnpflux(f, u, edge, electrolyte)\n\nFinite volume flux. It calls either sflux, cflux or aflux.\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.sflux","page":"Internal API","title":"LiquidElectrolytes.sflux","text":"sflux(ic,dϕ,ck,cl,βk,βl,bar_ck,bar_cl,electrolyte)\n\nSedan flux,  see Gaudeul/Fuhrmann 2022\n\nAppearantly first described by Yu, Zhiping  and Dutton, Robert, SEDAN III, www-tcad.stanford.edu/tcad/programs/sedan3.html\n\nsee also the 198? Fortran code available via  https://web.archive.org/web/20210518233152/http://www-tcad.stanford.edu/tcad/programs/oldftpable.html\n\nVerification calculation is in the paper.\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.aflux","page":"Internal API","title":"LiquidElectrolytes.aflux","text":"aflux(ic,dϕ,ck,cl,βk,βl,bar_ck,bar_cl,electrolyte)\n\nFlux expression based on reciprocal activity coefficents, see Fuhrmann, CPC 2015\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.cflux","page":"Internal API","title":"LiquidElectrolytes.cflux","text":"aflux(ic,dϕ,ck,cl,βk,βl,bar_ck,bar_cl,electrolyte)\n\nFlux expression based on centrals differences, see Gaudeul/Fuhrmann 2022, Cances\n\n\n\n\n\n","category":"function"},{"location":"internal/#LiquidElectrolytes.dμex","page":"Internal API","title":"LiquidElectrolytes.dμex","text":" dμex(βk, βl, electrolyte)\n\nCalculate differences of excess chemical potentials from reciprocal activity coefficient\n\n\n\n\n\n","category":"function"},{"location":"internal/#Electrochemical-calculations","page":"Internal API","title":"Electrochemical calculations","text":"","category":"section"},{"location":"internal/","page":"Internal API","title":"Internal API","text":"LiquidElectrolytes.splitz","category":"page"},{"location":"internal/#LiquidElectrolytes.splitz","page":"Internal API","title":"LiquidElectrolytes.splitz","text":"splitz(range::AbstractRange)\n\nIf range contains zero, split it into two parts, one with values <=0 and one with values >=0. Otherwise, return the range or its reverse, such that first value always is the one with the smallest absolute value.\n\n\n\n\n\nsplitz(range::Vector)\n\nVersion of splitz(range::AbstractRange) for vectors.\n\n\n\n\n\n","category":"function"},{"location":"examples/Example101_DLCap/","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"EditURL = \"https://github.com/j-fu/LiquidElectrolytes.jl/blob/main/examples/Example101_DLCap.jl\"","category":"page"},{"location":"examples/Example101_DLCap/#Double-Layer-Capacitance","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"","category":"section"},{"location":"examples/Example101_DLCap/","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"(source code)","category":"page"},{"location":"examples/Example101_DLCap/","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"Calculation of double layer capacitance of a symmetric 1:1 electrolyte.","category":"page"},{"location":"examples/Example101_DLCap/","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"Methods called:","category":"page"},{"location":"examples/Example101_DLCap/","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"ElectrolyteData\ndlcapsweep\nPNPSystem","category":"page"},{"location":"examples/Example101_DLCap/","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"module Example101_DLCap\nusing LessUnitful\nusing Unitful\nusing VoronoiFVM,ExtendableGrids,GridVisualize\nusing LiquidElectrolytes\nusing Parameters\nusing PyPlot,Colors\nusing DocStringExtensions\n\nfunction main(;voltages=-2:0.01:2,           ## Voltages/V\n              molarities=[0.001,0.01,0.1,1], ## Molarities/M\n\t      nref=0,\t                     ## Refinement level\n\t      scheme=:μex,\t             ## Flux calculation scheme\n\t      κ=10.0,                        ## Solvation number\n              Plotter=PyPlot,                ## Plotter\n\t      kwargs...                      ## Solver kwargs\n              )\n\n    # Obtain unit factors from LessUnitful.jl\n    @local_unitfactors nm cm μF V M m\n\n\n    # Create a standard 1D grid with grid spacing following geometric progression\n    hmin=1.0e-1*nm*2.0^(-nref)\n    hmax=1.0*nm*2.0^(-nref)\n    L=20.0*nm\n    X=geomspace(0,L,hmin,hmax)\n    grid=simplexgrid(X)\n\n    # Define boundary conditions\n    function bcondition(f,u,bnode,data)\n\t@unpack iϕ,Γ_we,Γ_bulk,ϕ_we = data\n\n\t# Dirichlet ϕ=ϕ_we at Γ_we\n\tboundary_dirichlet!(f,u,bnode,species=iϕ,region=Γ_we,value=ϕ_we)\n\n        # Bulk condition at Γ_bulk\n        bulkbcondition(f,u,bnode,data,region=Γ_bulk)\n    end\n\n    # Create electrolyte data\n    celldata=ElectrolyteData(nc=2,\n                             Γ_we=1,\n\t\t\t     Γ_bulk=2;\n\t\t\t     scheme,\n                             κ=fill(κ,2),\n                             c_bulk=fill(0.01M,2))\n\n    # Create Poisson-Nernst-Planck system\n    cell=PNPSystem(grid;bcondition,celldata)\n\n    # Visualization\n    vis=GridVisualizer(;resolution=(500,300),\n                       legend=:rt,\n                       clear=true,\n                       xlabel=\"φ/V\",\n                       ylabel=\"C_dl/(μF/cm^2)\",\n                       Plotter)\n\n    for imol=1:length(molarities)\n\n\tcolor=RGB(1-imol/length(molarities),0,imol/length(molarities))\n\n\n\tvolts,caps=dlcapsweep(cell;\n                              δ=1.0e-6,\n                              voltages=collect(voltages)*V,\n                              molarity=molarities[imol]*M,\n                              kwargs...)\n\n\tcdl0=dlcap0(celldata)\n\n\tscalarplot!(vis,volts/V,caps/(μF/cm^2);\n                    color,\n                    clear=false,\n                    label=\"$(molarities[imol])M\",\n                    markershape=:none)\n\n\tscalarplot!(vis,[0],[cdl0]/(μF/cm^2);\n                    clear=false,\n                    markershape=:circle,\n                    label=\"\")\n    end\n    reveal(vis)\nend\n\nend","category":"page"},{"location":"examples/Example101_DLCap/","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"Example101_DLCap.main()","category":"page"},{"location":"examples/Example101_DLCap/","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"","category":"page"},{"location":"examples/Example101_DLCap/","page":"Double Layer Capacitance","title":"Double Layer Capacitance","text":"This page was generated using Literate.jl.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Markdown\nMarkdown.parse(\"\"\"\n$(read(\"../../README.md\",String))\n\"\"\")","category":"page"},{"location":"examples/Example120_ORRCell/","page":"ORR cell","title":"ORR cell","text":"EditURL = \"https://github.com/j-fu/LiquidElectrolytes.jl/blob/main/examples/Example120_ORRCell.jl\"","category":"page"},{"location":"examples/Example120_ORRCell/","page":"ORR cell","title":"ORR cell","text":"Draft=true","category":"page"},{"location":"examples/Example120_ORRCell/#ORR-cell","page":"ORR cell","title":"ORR cell","text":"","category":"section"},{"location":"examples/Example120_ORRCell/","page":"ORR cell","title":"ORR cell","text":"(source code)","category":"page"},{"location":"examples/Example120_ORRCell/","page":"ORR cell","title":"ORR cell","text":"I-V sweep for Oxygen Reduction","category":"page"},{"location":"examples/Example120_ORRCell/","page":"ORR cell","title":"ORR cell","text":"Methods called:","category":"page"},{"location":"examples/Example120_ORRCell/","page":"ORR cell","title":"ORR cell","text":"ElectrolyteData\nivsweep\ndlcapsweep\nPNPSystem","category":"page"},{"location":"examples/Example120_ORRCell/","page":"ORR cell","title":"ORR cell","text":"module Example120_ORRCell\nusing ExtendableGrids,GridVisualize\nusing VoronoiFVM\nusing LiquidElectrolytes\nusing PyPlot,Colors, Parameters\nusing StaticArrays\nusing LessUnitful\nusing DocStringExtensions\n\n\n\n\nfunction main(;voltages=-1:0.005:1,compare=false,molarity=0.1,nref=0,κ=10.0,eneutral=false,scheme=:μex,Plotter=PyPlot,kwargs...)\n\n    @local_phconstants R N_A e\n    @local_unitfactors nm cm μF mol dm s\n    F=N_A*e\n\n\n    defaults=(; max_round=3,tol_round=1.0e-10, verbose=false, tol_relative=1.0e-7,tol_mono=1.0e-10)\n    kwargs=merge(defaults, kwargs)\n\n    hmin=1.0e-1*nm*2.0^(-nref)\n    hmax=1.0*nm*2.0^(-nref)\n    L=20.0*nm\n    X=geomspace(0,L,hmin,hmax)\n    grid=simplexgrid(X)\n\n\n    R0=10.0e-4*mol/(cm^2*s)\n    Δg=0.0\n    β=0.5\n    ϕ_we=0.0\n    ihplus=1\n    iso4=2\n    io2=3\n\n    function halfcellbc(f,u,bnode,data)\n        bulkbcondition(f,u,bnode,data)\n        @unpack iϕ,eneutral,ϕ_we,Γ_we,RT=data\n        if bnode.region==Γ_we\n            f.=0.0\n            if !data.eneutral\n                boundary_dirichlet!(f,u,bnode;species=iϕ,region=data.Γ_we,value=data.ϕ_we)\n            end\n            μh2o,μ=chemical_potentials!(MVector{4,eltype(u)}(undef),u,data)\n            A=(4*μ[ihplus]+μ[io2]-2μh2o+Δg + eneutral*F*(u[iϕ]-data.ϕ_we))/(RT)\n            r=rrate(R0,β,A)\n            f[ihplus]-=4*r\n            f[io2]-=r\n        end\n    end\n\n\n\n\n    celldata=ElectrolyteData(;nc=3, z=[1,-2,0], κ=fill(κ,3), Γ_we=1, Γ_bulk=2,eneutral,scheme)\n\n    @unpack iϕ,c_bulk=celldata\n\n\n    c_bulk[io2]=0.001*mol/dm^3\n    c_bulk[iso4]=molarity*mol/dm^3\n    c_bulk[ihplus]=2.0*molarity*mol/dm^3\n\n\n    @assert isapprox(celldata.c_bulk'*celldata.z,0, atol=1.0e-12)\n\n    cell=PNPSystem(grid;bcondition=halfcellbc,celldata)\n    check_allocs!(cell,false)\n\n\n    # Compare electroneutral and double layer cases\n    if compare\n        celldata.eneutral=false\n\tvolts,currs, sols=ivsweep(cell;voltages,ispec=io2,kwargs...)\n\n        celldata.eneutral=true\n        nvolts,ncurrs, nsols=ivsweep(cell;voltages,ispec=io2,kwargs...)\n\n        vis=GridVisualizer(;Plotter,resolution=(600,400),clear=true,legend=:lt,xlabel=\"Δϕ/V\",ylabel=\"I/(A/m^2)\")\n        scalarplot!(vis,volts,currs,color=\"red\",markershape=:utriangle,markersize=7, markevery=10,label=\"PNP\")\n        scalarplot!(vis,nvolts,ncurrs,clear=false,color=:green,markershape=:none,label=\"NNP\")\n        return reveal(vis)\n    end\n\n    vis=GridVisualizer(resolution=(1200,400),layout=(1,5),Plotter=PyPlot)\n\n    volts,currs, sols=ivsweep(cell;voltages,ispec=io2,kwargs...)\n    tsol=VoronoiFVM.TransientSolution(sols,volts)\n\n    for it=1:length(tsol.t)\n        tsol.u[it][io2,:]/=mol/dm^3\n        tsol.u[it][ihplus,:]/=mol/dm^3\n        tsol.u[it][iso4,:]/=mol/dm^3\n    end\n\n    xmax=20*nm\n    xlimits=[0,xmax]\n    aspect=3.5*xmax/(tsol.t[end]-tsol.t[begin])\n\n    scalarplot!(vis[1,1],currs,volts,markershape=:none,title=\"IV\",xlabel=\"I\",ylabel=\"V\")\n    scalarplot!(vis[1,2],cell,tsol;species=io2,aspect,xlimits,title=\"O2\",colormap=:summer)\n    scalarplot!(vis[1,3],cell,tsol;species=ihplus,aspect,xlimits,title=\"H+\",colormap=:summer)\n    scalarplot!(vis[1,4],cell,tsol;species=iϕ,aspect,xlimits,title=\"ϕ\",colormap=:bwr)\n    scalarplot!(vis[1,5],tsol[io2,1,:],volts,title=\"c_o2(0)\",xlabel=\"O2\",ylabel=\"V\")\n\n    reveal(vis)\nend\n\nend","category":"page"},{"location":"examples/Example120_ORRCell/","page":"ORR cell","title":"ORR cell","text":"","category":"page"},{"location":"examples/Example120_ORRCell/","page":"ORR cell","title":"ORR cell","text":"This page was generated using Literate.jl.","category":"page"}]
}
