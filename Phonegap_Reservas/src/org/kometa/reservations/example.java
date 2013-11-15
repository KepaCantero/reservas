package org.kometa.reservations;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import android.content.Intent;
import android.os.Bundle;
import org.apache.cordova.*;


public class example extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init(); 
                
        appView.addJavascriptInterface(this, "MainActivity");
        
        super.loadUrl("file:///android_asset/www/index.html");
    }


    public void addEventToCalendarString(String sdate,String hora, String mesa){

    	sdate = sdate.replace('-','/');
    	String cachosHora[] = hora.split(":");
    	int intHora = Integer.parseInt(cachosHora[0]);
    	int intMinuto = Integer.parseInt(cachosHora[1]);
        String strMinuto = "";
    	try {
        	Date startDate;
            SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
            startDate= (Date)df.parse(sdate);
            Calendar cal = Calendar.getInstance();
        	cal.setTime(startDate);
        	cal.set(Calendar.HOUR_OF_DAY, intHora);
        	cal.set(Calendar.MINUTE, intMinuto);
        	Intent intent = new Intent(Intent.ACTION_EDIT);
        	intent.setType("vnd.android.cursor.item/event");
        	intent.putExtra("beginTime", cal.getTimeInMillis());
        	//Aquí lo suyo sería pasar como parámetro la duración de la cena (una hora, hora y media...) y sumar en consecuencia
        	intent.putExtra("endTime", cal.getTimeInMillis() + 60*60*1000);
        	/*intent.putExtra("allDay", false);
        	intent.putExtra("rrule", false);*/  
        	if (intMinuto < 10) { //Esto es para que en el texto de la reserva los minutos tengan siempre dos caracteres
        		strMinuto = "0" + intMinuto;
        	} else {
        		strMinuto = "" + intMinuto;
        	}
        	intent.putExtra("title", "Reserva para "+ mesa + " a las " + intHora + ":" + strMinuto );
        	startActivity(intent);

        } catch (Exception e) {}
    }
}






