# Billion-dollar-disaster-US

The more time I spend in nature the more I'm facinated by it. Inspried by Albert Einstein's quote -  *Look deep into nature, and then you will understand everything better*. 

At the same time climate change is becoming real. Following [Aaron Swartz](https://en.wikipedia.org/wiki/Aaron_Swartz)'s idea - *What is the most important thing you could be working on in the world right now? And if you're not working on that, why aren't you?* I believe this is the  most important thing right now.  

In this repository I analyse deeply the most destructiv natural disasters happing in the US over the last decades. The main objective is to understand patterns and possilbe changes over time. On a practical side I showcase  the whole process of a data visualisation project using the porgramming language JavaScript for the data cleaning, EDA, plotting and the final dynamic visualisation. 

The data is provided by [NCEI](https://www.ncei.noaa.gov/access/billions/events/US/1980-2023?disasters[]=all-disasters). 

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






