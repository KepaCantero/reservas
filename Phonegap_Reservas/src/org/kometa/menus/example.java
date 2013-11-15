package org.kometa.menus;

import android.os.Bundle;
import android.webkit.WebSettings;

import org.apache.cordova.*;

public class example extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        //super.loadUrl(Config.getStartUrl());
        super.loadUrl("file:///android_asset/www/index.html");
        /*Lo siguiente sirve para que la app no guarde cach� en Android,
         * lo que permite que los datos tra�dos con los get se actualicen
         * y no se carguen desde cach�.
         */
        if (super.appView != null) { 
        	super.appView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE); 
        }
    }
}

