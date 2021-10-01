const format = d3.format(",");
d3.csv('wealth-health-2014.csv',d3.autoType).then(data=>{
	console.log(data);

    data.sort((a,b)=>b.Population-a.Population);

const margin = {top:20, left:20, right:20, bottom:20};
const width = 650 - margin.left - margin.right; 
const height = 500 - margin.top - margin.bottom;
    



const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    

const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d=>d.Income))
	.range([0,width]);
const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d=>d.LifeExpectancy))
	.range([height,0]);
const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

const sizeScale = d3.scaleLinear()
    .domain(d3.extent(data,d=>d.Population))
    .range([5,25]);


svg.selectAll(".country")
	.data(data)
    .enter()
	.append("circle")
	.attr("cy",d=>yScale(d.LifeExpectancy))
	.attr("cx",d => xScale(d.Income))
	.attr("r",d=>sizeScale(d.Population))
	.attr("fill", d=>colorScale(d.Region))
	.attr("stroke", "black")
    .attr("opacity", .7)
    .on("mouseenter",(event,d)=>{
        const p = d3.pointer(event,window);
        d3.
            select(".tooltip")
            .style("display","block")
            .style("top",(p[1]+10)+"px")
            .style("left",(p[0]+10)+"px").html(`
                <div>Country: ${d.Country}</div>
                <div>Region: ${d.Region}</div>
                <div>Population: ${format(d.Population)}</div>
                <div>Income: ${format(d.Income)}</div>
                <div>LifeExpectancy: ${d.LifeExpectancy}</div>

            `);

    })

    .on("mouseleave", (event,d)=> {
        d3.select(".tooltip").style("display","none");
    });


   







const yAxis = d3.axisLeft()
	.scale(yScale)
    //.ticks(5, "~s")
svg.append("g")
	.attr("class", "axis y-axis")
    .attr("transform", `translate(0, 0)`)
    .call(yAxis)

const xAxis = d3
    .axisBottom()
	.scale(xScale)
    .ticks(5, "~s")
svg.append("g")
	.attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);





    
svg.append("text")
    .attr('x', width-100)
    .attr('y',height)
    // add attrs such as alignment-baseline and text-anchor as necessary
    .attr('alignment-baseline','baseline')
    .attr("dy",-5)
    .attr('font-size','12')
    .text("Income")


svg.append("text")
    .attr("writing-mode", "tb")
    // add attrs such as alignment-baseline and text-anchor as necessary
    .attr('alignment-baseline','baseline')
    .attr("dx",10)
    .attr('font-size','12')
    .text("Life Expectancy")

const legend = svg.append('g')
legend.selectAll('.legend-color')
    .data(colorScale.domain())
    .enter()
    .append('rect')
    .attr('class','legend-color')
    .attr('width',15)
    .attr('height',15)
    .attr('x',width-150)
    .attr('y',(d,i)=>i*17+height*2/3)
    .attr('fill',d=>colorScale(d));

legend.selectAll('.legend-label')
    .data(colorScale.domain())
    .enter()
    .append('text')
    .attr('class','legend-label')
    .attr('x',width-130)
    .attr('y',(d,i)=>i*17+height*2/3)
    .attr('font-size','12')
    .attr('alignment-baseline','hanging')
    .text(d=>d)
})