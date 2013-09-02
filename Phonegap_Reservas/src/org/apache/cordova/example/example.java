/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package org.apache.cordova.example;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import org.apache.cordova.*;
import android.util.Log;
public class example extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init(); 
                
        appView.addJavascriptInterface(this, "MainActivity");
        
        super.loadUrl("file:///android_asset/www/main.html");
    }


    public void addEventToCalendarString(String sdate,String hora, String mesa){
    	//Calendar cal = Calendar.getInstance();       
    	//intent.putExtra("beginTime", componentTimeToTimestamp(year, month, day, hour, 0));
    	
    	long startMillis = 0; 
    	sdate = sdate.replace('-','/');
    	System.out.println("creando el calenar");
        try
        {
        	System.out.println(sdate);
        	Date startDate;
            SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
            startDate= (Date)df.parse(sdate);
            System.out.println(startDate);    
           
            System.out.println(startDate); 
            Calendar cal = Calendar.getInstance();
        	cal.setTime(startDate);
        	cal.set(Calendar.HOUR_OF_DAY, 24);
        	Intent intent = new Intent(Intent.ACTION_EDIT);
        	intent.setType("vnd.android.cursor.item/event");
        	intent.putExtra("beginTime", cal.getTimeInMillis());
        	intent.putExtra("allDay", true);
        	intent.putExtra("rrule", "FREQ=YEARLY");
        	intent.putExtra("endTime", cal.getTimeInMillis());
        	intent.putExtra("title", "Reserva de "+ mesa + " personas " + "a las " + hora );
        	startActivity(intent);

        }
        catch (Exception e)
        {}
    } 
}






