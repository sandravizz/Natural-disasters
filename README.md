# Billion-dollar-disaster-US

In this repo I showcase the whole process of a web based data visualisation project using JavaScript libraries for the EDA as well as the final visualisation. 

Data source: [NCEI](https://www.ncei.noaa.gov/access/billions/events/US/1980-2023?disasters[]=all-disasters)

![One of nature's biggest force: hurricanes](images/hurricane.png)

## EDA

The first step is always to check your data and variable structure and extreme values as well as general patterns and trends. For this purpose I used [arquero.js](https://uwdata.github.io/arquero/)  as a data processing library and [plot.js](https://observablehq.com/plot/) 
 as a plotting library. Please find the whole process in this [Observable notebook](https://observablehq.com/@sandraviz/billion-dollar-disasters-arquero-js-plot-js?collection=@sandraviz/billion-dollar-disaster) 

 ## Viz exploration

 When designing a data visualization we have two main restrains/conditions the objective and the data themselves. 

 ### Objective 

 As [Edward Tufte](https://de.wikipedia.org/wiki/Edward_Tufte) described it very well 

 *"Graphical excellence is that which gives to the viewer the greatest number of ideas in the shortest time with the least ink in the smallest space."*

 hence we have a general objective when visualising data which is basically the idea of **just seeing the relevant patterns**. 

 Obviously each project has its individual objectivs. In this case its about checking the **representation of "climate change"** in terms of anomalies here in relation to extreme disasters in the US. 

 ### Data 

After data checking and EDA we can describe the data as **event based with a long historical context**. With event based I mean that its not a parameter that changes over time its about weather a billion dollar disaster has happened or not and then checking the related KPIs in this case **deaths** adn **damage in $**. On the other hand as the data is recorded over several decades we have a lot of context and aggregation potential to draw robust conclusions. 






