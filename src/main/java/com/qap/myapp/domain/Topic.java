package com.qap.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Topic.
 */
@Entity
@Table(name = "topic")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Topic implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "topic")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "questions", "topic" }, allowSetters = true)
    private Set<SubTopic> subTopics = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Topic id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Topic name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<SubTopic> getSubTopics() {
        return this.subTopics;
    }

    public Topic subTopics(Set<SubTopic> subTopics) {
        this.setSubTopics(subTopics);
        return this;
    }

    public Topic addSubTopic(SubTopic subTopic) {
        this.subTopics.add(subTopic);
        subTopic.setTopic(this);
        return this;
    }

    public Topic removeSubTopic(SubTopic subTopic) {
        this.subTopics.remove(subTopic);
        subTopic.setTopic(null);
        return this;
    }

    public void setSubTopics(Set<SubTopic> subTopics) {
        if (this.subTopics != null) {
            this.subTopics.forEach(i -> i.setTopic(null));
        }
        if (subTopics != null) {
            subTopics.forEach(i -> i.setTopic(this));
        }
        this.subTopics = subTopics;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Topic)) {
            return false;
        }
        return id != null && id.equals(((Topic) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Topic{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
