#=
# Double Layer Capacitance
([source code](SOURCE_URL))

Calculation of double layer capacitance of a symmetric 1:1 electrolyte.

Methods called:
- [`ElectrolyteData`](@@ref)
- [`dlcapsweep`](@@ref)
- [`PNPSystem`](@@ref)
=#
module Example102_DLCap
using LessUnitful
using VoronoiFVM,ExtendableGrids,GridVisualize
using LiquidElectrolytes
using PyPlot,Colors


function main(;voltages=-2:0.01:2,           ## Voltages/V
              molarities=[0.001,0.01,0.1,1], ## Molarities/M
	      nref=0,	                     ## Refinement level
	      scheme=:μex,	             ## Flux calculation scheme
	      κ=10.0,                        ## Solvation number
              Plotter=PyPlot,                ## Plotter
	      kwargs...                      ## Solver kwargs
              )
    
    ## Obtain unit factors from LessUnitful.jl
    @local_unitfactors nm cm μF V M m
    
    
    ## Create a standard 1D grid with grid spacing following geometric progression
    hmin=1.0e-1*nm*2.0^(-nref)
    hmax=1.0*nm*2.0^(-nref)
    L=20.0*nm
    X=geomspace(0,L,hmin,hmax)
    grid=simplexgrid(X)

    ## Define boundary conditions 
    function bcondition(f,u,bnode,data)
	(;iϕ,Γ_we,Γ_bulk,ϕ_we) = data
        
	## Dirichlet ϕ=ϕ_we at Γ_we
	boundary_dirichlet!(f,u,bnode,species=iϕ,region=Γ_we,value=ϕ_we)

        ## Bulk condition at Γ_bulk
        bulkbcondition(f,u,bnode,data,region=Γ_bulk)
    end
    
    function mlarities(m)
        mol_H2O=55.4M
        mol_solvent=1.0e-5M
        [m,m,mol_H2O-2*(1+κ)*m-mol_solvent]
    end
#    return sum(mlarities(0.01M))/M
    ## Create electrolyte data
    celldata=ElectrolyteData(nc=3,
                             Γ_we=1,
			     Γ_bulk=2;
                             z=[1,-1,0],
			     scheme,
                             κ=[κ,κ,0],
                             c_bulk=mlarities(0.01M))

    ## Create Poisson-Nernst-Planck system
    cell=PNPSystem(grid;bcondition,celldata)
    
    ## Visualization
    vis=GridVisualizer(;resolution=(500,300),
                       legend=:rt,
                       clear=true,
                       xlabel="φ/V",
                       ylabel="C_dl/(μF/cm^2)",
                       Plotter)

    for imol=1:length(molarities)
        
	color=RGB(1-imol/length(molarities),0,imol/length(molarities))

        
	volts,caps=dlcapsweep(cell;
                              δ=1.0e-6,
                              voltages=collect(voltages)*V,
                              molarity=mlarities(molarities[imol]*M),
                              kwargs...)

	cdl0=dlcap0(celldata)
        
	scalarplot!(vis,volts/V,caps/(μF/cm^2);
                    color,
                    clear=false,
                    label="$(molarities[imol])M",
                    markershape=:none)

	scalarplot!(vis,[0],[cdl0]/(μF/cm^2);
                    clear=false,
                    markershape=:circle,
                    label="")
    end
    reveal(vis)
end

end 

#=
```@example Example101_DLCap
Example101_DLCap.main()
```
=#

