const svgHeight = 400
const svgWidth = 1000

const margin = {
    top: 50,
    right: 50,
    bottom: 90,
    left: 50
    }

const chartHeight = svgHeight - margin.top - margin.bottom
const chartWidth = svgWidth - margin.left - margin.right


const svg = d3.select("#scatter").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

const chartG = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    
const xScale = (data, selection) => {

    let selectionData
    
    if (selection === "In Poverty (%)") {
        selectionData = data.map(d => parseInt(d.poverty))
    } else if (selection === "Age (Median)") {
        selectionData = data.map(d => parseInt(d.age))
    } else if (selection === "House Hold Income (Median)")
        selectionData = data.map(d => parseInt(d.income))

    console.log(selectionData)

    const x = d3.scaleLinear()
        .domain([8, d3.max(selectionData)])
        .range([0, chartWidth])
    return(x)
}
const renderXAxis = (xAxisG, newXScale) => {
    xAxis = d3.axisBottom(newXScale)
    xAxisG.transition()
    .duration(500)
    .call(xAxis)
}

const renderCircles = (circleG, newXScale, selection) => {

    let selectionDataKey
    
    if (selection === "In Poverty (%)") {
        selectionDataKey = "poverty"
    } else if (selection === "Age (Median)") {
        selectionDataKey = "age"
    } else if (selection === "House Hold Income (Median)") {
        selectionDataKey = "income"
    }

    circleG.attr("transform", d => `translate(${x(parseInt(newXScale([d.selectionDataKey])))})`)

}


d3.csv("assets/data/data.csv").then(data => {

    console.log(data)

    const y = d3.scaleLinear()
        .domain([4, d3.max(data.map(d => parseInt(d.healthcare)))])
        .range([chartHeight, 0])

    const x = d3.scaleLinear()
        .domain([8, d3.max(data.map(d => parseInt(d.poverty)))])
        .range([0, chartWidth])

   
    const yAxis = d3.axisLeft(y)
    const xAxis = d3.axisBottom(x)

    chartG.append("g")
        .call(yAxis)

    const xAxisG = chartG.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)


        const labelArea = svg
            .append("g")
            .attr("transform", `translate(${svgWidth / 2}, ${svgHeight - margin.bottom + 40})`)

        labelArea.append("text")
            .attr("stroke", "#000000")
            .text("In Poverty (%)")

        labelArea.append("text")
            .attr("stroke", "#000000")
            .attr("dy", 20)
            .text("Age (Median)") 

        labelArea.append("text")
            .attr("stroke", "#000000")
            .attr("dy", 40)
            .text("House Hold Income (Median)")
           
        labelArea.selectAll("text")
            .on("click", function() {
                const selection = d3.select(this).text()
                console.log(selection)
                newXScale = xScale(data, selection)
                renderXAxis(xAxisG, newXScale)
                renderCircles(circleG, newXScale, selection) 
            }) 

       

        
        
    const plotArea = chartG.append("g")
    
    const circleG = plotArea.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x(d.poverty)}, ${y(d.healthcare)})`)
       
    circleG.append("circle")
        .attr("r", 14)

    circleG.append("text")
        .text(d => d.abbr)
        .attr("stroke", "#FFFFFF")
        .attr("fill", "#FFFFFF")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        
})