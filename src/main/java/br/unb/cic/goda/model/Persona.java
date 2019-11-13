package br.unb.cic.goda.model;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.*;

public class Persona {
    protected String name;
    protected String description;
    protected ArrayList<String> contexts;

    public Persona(String personaJSON) {

        JsonObject jsonObject = new JsonParser().parse(personaJSON).getAsJsonObject();
        System.out.println(jsonObject);
        this.name = jsonObject.get("personaName").getAsString();
        this.description = jsonObject.get("personaDescription").getAsString();
        JsonArray contextArray = jsonObject.get("personaContexts").getAsJsonArray();
        System.out.println(this.name);
        System.out.println(this.description);
        int i;
        this.contexts = new ArrayList<>();
        for(i = 0; i < contextArray.size(); i++){
            JsonObject context = contextArray.get(i).getAsJsonObject();
            String contextName = context.get("contextName").getAsString();
            if(contextName != null){
                this.contexts.add(contextName);
            }
        }
        System.out.println(this.contexts);
    }
}
