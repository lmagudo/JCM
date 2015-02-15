<%@ WebHandler Language="C#" Class="getLayers" %>

using System;
using System.Web;
using System.Linq;
using System.Net;
using System.Collections.Generic;
using Newtonsoft.Json;


public class getLayers : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string respuesta = "";
        //var url = "http://geocatmin.ingemmet.gob.pe/ArcGIS/services/SERV_GEOLOGIA/MapServer/WMSServer?request=getcapabilities&service=wms&version=1.3.0";
        //var url = "http://www.idecyl.jcyl.es/IGCyL/services/ReferenciaGeografica/UnidadesAdministrativas/MapServer/WMSServer?request=GetCapabilities&service=WMS";
        
        string url = context.Request.QueryString["wmsuri"];
        
        //if (url.Substring(url.Length) != "?") 
        //{
        //    url += "?";
        //}
        url += "&request=getcapabilities&service=wms";
        try
        {
        
        System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
        request.Method = "GET";
       
            WebResponse resp = request.GetResponse();

            System.IO.Stream str = resp.GetResponseStream();

            System.IO.StreamReader reader = new System.IO.StreamReader(str);
            System.Xml.Linq.XDocument xdoc = System.Xml.Linq.XDocument.Load(str);

            List<Layer> listaLayers = new List<Layer>();

            var capabilities = xdoc.Elements().First();
            var capability = capabilities.FirstNode.NextNode;
            System.Xml.Linq.XElement elemento = capability as System.Xml.Linq.XElement;
            var ly = elemento.Elements();
            foreach (System.Xml.Linq.XElement xEle in ly) 
            {
                if (xEle.Name.LocalName == "Layer") 
                {
                    var flayers  = xEle.Elements();
                    foreach (System.Xml.Linq.XElement layer in flayers) 
                    {
                        if (layer.Name.LocalName == "Layer") 
                        {
                            Layer l = new Layer();
                            var flayerele = layer.Elements();
                            foreach (System.Xml.Linq.XElement lelement in flayerele)
                            {
                                
                                
                                if (lelement.Name.LocalName == "Name") 
                                {
                                    l.Name = lelement.Value.ToString();
                                    
                                }
                                if (lelement.Name.LocalName == "Title")
                                {
                                    l.Title = lelement.Value.ToString();

                                }

                                
                                
                            }
                            listaLayers.Add(l);
                        }
                    }
                   
                }
                
           }

            List<string> test = new List<string>();
            
        
            
            respuesta = JsonConvert.SerializeObject(listaLayers);
            
           // respuesta = xdoc.ToString();
        }
        catch(Exception ex)
        {
            respuesta = ex.ToString();
        }
        context.Response.Write(respuesta);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}


public class Layer
{
    public string Name { get; set; }
    
    public string Title { get; set; }
    
}